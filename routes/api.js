var express = require('express');
var router = express.Router();
var ejwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');

var models  = require('../models');
var secret = require('../config/secret').secret;

const crypto = require('crypto');
const hash = crypto.createHash('sha512');

var mail = require('../utils/mail');

var expiresIn = 10; //604800; // 秒, 一週間？

// 応答
var messages = {
    
}
function response_error(error) {

}
function response(req, status, id, additional_message = "") {
    var msg = messages[id].text + additional_message
    console.log(`${id} (${status}): ${msg}`)
    req.status(status).json({
        code: status,
        id: id,
        message: msg
    })
}

// unix epoch
function getUnixtime(time) {
    if (time === undefined) {
        return Math.floor(new Date() / 1000);
    }
    return Math.floor(new Date(time) / 1000);
}
function getDateFromUnixtime(time) {
    return new Date(time * 1000)
}
function is_expired(iat) {
    var current_date = getUnixtime();
    return false;
}

function get_user_by_username(username) {
    return models.User.findOne({
        where: {
            username: username
        }
    }).catch(err => {
        console.log("Error [get_user_by_username()]: ", err)
    }).then(result => {
            if (result === undefined) {
                throw "User Not Found"
            }
            return result
        }
    )
}
function update_expire_date(username, date = new Date()) {
    return get_user_by_username(username).then(result => {
        return result.update("expire", new Date())
            .catch(err => console.log(err))
    })
}
function delete_user(username) {
    return get_user_by_username(username).then(result => {
        return result.update("deleted", true)
            .catch(err => console.log(err))
    })
}
function get_exp(username) {
    return models.User.findAll({
        where: {
            username: username
        }
    })
}
function get_hash(text) {
    // sha512
}
function authenticate(param) {
    return models.User.findOne({
        where: {
            username: param.username
        }
    }).catch(err => {
        console.log("Error [authenticate()]: ", err)
    }).then(result => {
            var is_username_valid = result != undefined
            var is_password_valid = result && result.password === param.password
            return {
                username: result.username,
                password: result.password,
                is_username_valid,
                is_password_valid
            }
        }
    )
}

var apis = [
    {
        // セッション作成
        method: "post", url: "/session", auth: false,
        func: function(req, res) {
            // 認証
            var {username, password} = req.body;
            console.log(req.body);
            console.log(`認証: ${username}, ${password}`);
            authenticate({username, password}).then(
                result => {
                    if (!result.is_username_valid) {
                        console.log("認証失敗: ユーザ名が違います");
                        res.status(400).json({error: "Authentication Failed", message: "wrong username"});
                        return;
                    }
                    if (!result.is_password_valid) {
                        console.log("認証失敗: パスワードが違います");
                        res.status(400).json({error: "Authentication Failed", message: "wrong password"});
                        return;
                    }

                    // トークン作成
                    var payload = {
                        username: result.username,
                        password: result.password,
                        exp: getUnixtime() + expiresIn,
                    }
                    var token = jwt.sign(payload, secret);
                    var data = {
                        id_token: token,
                        access_token: "",
                        message: "hi"
                    };
                    res.json(data);
                    update_expire_date(username)
                }
            );
        }
    },
    {
        // セッション削除
        method: "delete", url: "/session", auth: true,
        func: function(req, res) {
            var {username} = req.user;
            update_expire_date(username).then(result => {
                console.log("ログアウトしました")
                res.status(200).json({"message": "ログアウト"});
            }).catch(e => {                
                console.log("ユーザが存在しません")
                res.status(400).json({"message": "ユーザが存在しません"});
            })
        }
    },
    {
        // セッションテスト
        method: "get", url: "/session/test", auth: true,
        func: function(req, res) {
            var {username, password} = req.user;
            console.log("認証が成功しました")
            res.json({"message": `validation 成功: ${username}, ${password}`});
        }
    },
    {
        // ユーザ作成
        method: "post", url: "/users", auth: false,
        func: function (req, res) {
            var {username, password, email} = req.body;
            // 認証
            models.User.create({
                username: username,
                password: password,
                email: email
            }).then(function() {
                console.log("ユーザを作成しました")
                res.status(201).json({message: "user creation: success"});
            }).catch(err => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    console.log("ユーザが存在します")
                    res.status(409).json({error: "User Creation Failed", message: "user already exists"});
                }
            })
        }
    },
    {
        // ユーザ削除
        method: "delete", url: "/users/:id", auth: true,
        func: function (req, res) {
            let {username} = req.user;
            delete_user(username).then(function(result) {
                console.log("ユーザを削除しました")
                res.status(200).json({message: "User Deletion: success"})
            }).catch(e => {                
                console.log("ユーザが存在しません")
                res.status(400).json({"message": "ユーザが存在しません"});
            })
        }
    },
    {
        // ユーザ取得
        method: "get", url: "/users/:id", auth: false,
        func: function (req, res) {
            var {username, password} = req.user;
            models.User.findAll({
                where: {
                    id: req.params.id
                }
            }).then(result => {
                console.log(result);
                res.send(result);
            });
        }
    },
    {
        // 自分取得
        method: "get", url: "/me", auth: false,
        func: function (req, res) {
            get_user_by_username(req.user.username).then(result => {
                console.log(result);
                res.json({result});
            }).catch(e => {

            })
        }
    },
    {
        // メール送信
        method: "post", url: "/mail", auth: false,
        func: function (req, res) {
            var {email} = req.body;
            //mail
        }
    }
]

function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        var innerError = err.inner && err.inner.name;
        res.status(401).json({error: err.name, message: innerError});
    }
}
function isRevoked(req, payload, done) {
    let username = payload.username
    let created_date = payload.iat
    get_user_by_username(username).then(result => {
        let expire_date = getUnixtime(result.get("expire"))
        let is_revoked = created_date < expire_date
        done(null, is_revoked)
    }).catch(e => {
        console.log("error occured")
        done(null, true)
    })
}
for (var a of apis) {
    if (a.auth) {
        router[a.method](a.url, ejwt({secret: secret, isRevoked: isRevoked}), a.func, errorHandler);
    } else {
        router[a.method](a.url, a.func);
    }
}



router.get('*', function(req, res, next) {
    res.status(404).json({error: "Not Found", message: ""});
});

/*
router.use('/', function(req, res, next) {
    if (true) {
        // res.render('index', { title: 'Express' });
        res.send('nope-');
    } else {
      next();
    }
});
*/

module.exports = router;
