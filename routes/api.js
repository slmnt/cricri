var express = require('express');
var router = express.Router();
var ejwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var url = require('url');

var models  = require('../models');
var secret = require('../config/secret').secret;
var path_cfg  = require('../config/path');

var multer  = require('multer')
var upload = multer({ dest: path_cfg.upload })

const crypto = require('crypto');
const hash = crypto.createHash('sha512');

import errors from '../utils/errors'
var mail = require('../utils/mail');

var expiresIn = 300; //604800; // トークンの有効時間 (秒)  一週間ほど？

// 応答
var messages = {

}
function response(res, status, error, additional_message = "") {
    console.log(`${error.name} (${status}): ${additional_message}`)
    res.status(status).json({
        ok: false,
        code: status,
        id: error.name,
        message: additional_message
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

function get_user(param) {
    return models.User.findOne({
        where: param
    }).catch(err => {
        console.log("Error [get_user()]: ", param, err)
    }).then(result => {
            if (result === undefined) {
                throw new errors.UserNotFound("")
            }
            if (result === null) {
                throw new errors.TableNotFound("")
            }
            return result
        }
    )
}
function project_to_object(p) {
    return {
        id: p.id,
        name: p.name,
        desc: p.desc,
        owner: {
            id: p.getOwner().id,
            name: p.getOwner().name,
            avatar: p.getOwner().avatar
        }
    }
}
function get_project(param) {
    return models.Project.findOne({
        where: param
    }).catch(err => {
        console.log("Error [get_project()]: ", param, err)
    }).then(result => {
            if (result === undefined) {
                throw new errors.ProjectNotFound("")
            }
            if (result === null) {
                throw new errors.TableNotFound("")
            }
            return project_to_object(result)
        }
    )
}

function search_project(query) {
    var {q, s, p, l} = query // query, sort, page, limit
    p = p && parseInt(p)
    l = l && parseInt(l) || 10 // デフォルトで 10
    var param = {
        where: {
            $or: [
                { 'name': { like: '%' + q + '%' } },
            ]
        }
    }
    if (p && l) {
        param.offset = (p - 1) * l
    }
    if (l) {
        param.limit = l
    }
    if (s) {
        param.order = [
            [s, 'DESC'],
        ]
    }
    return models.Project.findAll(param)
    .catch(err => {
        console.log("Error [get_project()]: ", err)
    }).then(result => {
            if (result === undefined) {
                throw new errors.ProjectNotFound("")
            }
            if (result === null) {
                throw new errors.TableNotFound("")
            }
            return result.map(p => project_to_object(p))
        }
    )
}

function update_expire_date(username, date = new Date()) {
    return get_user({username}).then(result => {
        return result.update("expire", new Date())
    })
}
function delete_user(username) {
    return get_user({username}).then(result => {
        return result.update("deleted", true)
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
            if (result === null) {
                throw new errors.TableNotFound("")
            }
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
                        ok: true,
                        id_token: token,
                        access_token: "",
                        message: "hi"
                    };

                    // expire 更新
                    var token_obj = jwt.decode(token)
                    var new_expire = getDateFromUnixtime(parseInt(token_obj.iat, 10))
                    console.log(new_expire)
                    update_expire_date(username, new_expire)
                    console.log("auth success")

                    //
                    res.json(data);
                }
            ).catch(e => {
                response(res, 400, e)
            })
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
                response(res, 400, e, "ユーザが存在しません")
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
            }).catch(e => {
                switch (e.name) {
                    case "SequelizeUniqueConstraintError":
                        response(res, 409, errors.UserAlreadyExists, "ユーザがすでに存在します")
                        break
                    case "SequelizeValidationError":
                        let invalid_fields = e.errors.map(v => v.path)
                        let fields_text = invalid_fields.join(", ")

                        response(res, 409, errors.InvalidEmail, fields_text + "が不正です")
                        break
                    default:
                        response(res, 400, e)
                }
            })
        }
    },
    {
        // ユーザ削除
        method: "delete", url: "/users", auth: true,
        func: function (req, res) {
            let {username} = req.user;
            delete_user(username).then(function(result) {
                console.log("ユーザを削除しました")
                res.status(200).json({message: "User Deletion: success"})
            }).catch(e => {
                response(res, 400, e, "ユーザが存在しません")
            })
        }
    },
    {
        // ユーザ取得
        method: "get", url: "/users/:id", auth: false,
        func: function (req, res) {
            get_user({id: req.params.id})
            .then(result => {
                console.log(result);
                res.send(result);
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // 自分の情報を取得
        method: "get", url: "/me", auth: true,
        func: function (req, res) {
            get_user({username: req.user.username}).then(result => {
                res.status(200).json({
                    id: result.id,
                    username: result.username,
                    email: result.email,
                    avatar: result.avatar
                });
            }).catch(e => {
                console.log(e)
                response(res, 400, e)
            })
        }
    },
    {
        // ユーザのプロジェクト取得
        method: "get", url: "/users/:id/projects/", auth: false,
        func: function (req, res) {
            get_user({id: req.params.id})
            .then(result => {
                result.getProjects().then(function (projects) {
                    res.json(projects)
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // プロジェクト作成
        method: "post", url: "/projects", auth: true,
        func: function (req, res) {
            var {username} = req.user
            var {name, desc} = req.body
            get_user({username}).then(user => {
                models.Project.create({
                    name: name,
                    desc: desc,
                }).then(project => {
                    user.addProject(project)
                    console.log(user)
                    project.setOwner(user)
                    res.json(project)
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // プロジェクト検索
        method: "get", url: "/projects", auth: false,
        func: function (req, res) {
            var {query} = url.parse(req.url, true)
            console.log("/projects")
            search_project(query).then(result => {
                console.log(result);
                res.send(result);
            }).catch(e => {
                console.log(e)
                response(res, 400, e)
            })
        }
    },
    {
        // プロジェクト取得
        method: "get", url: "/projects/:id", auth: false,
        func: function (req, res) {
            console.log("/projects/:id", req.params.id)
            get_project({id: req.params.id}).then(result => {
                console.log(result);
                res.send(result);
            }).catch(e => {
                response(res, 400, e)
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
    },
    {
        // プロジェクトメッセージ（コメント）作成
        method: "post", url: "/projects/:id/comments", auth: true,
        func: function (req, res) {
            var {username} = req.user
            var {message} = req.body
            get_user({username}).then(user => {
                get_project({id: req.params.id}).then(project => {
                    models.ProjectMsg.create({
                        message: message,
                    }).then(projectMsg => {
                        user.addMsg(projectMsg)
                        console.log(user)
                        projectMsg.setOwner(user)
                        console.log(projectMsg)
                        project.addMsg(projectMsg)
                        console.log(project)
                        projectMsg.setPlace(project)
                        console.log(projectMsg)
                    })
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    }
]

function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        var innerError = err.inner && err.inner.name;
        response(res, 401, err, innerError)
    }
}
function isRevoked(req, payload, done) {
    let username = payload.username
    let created_date = payload.iat
    get_user({username}).then(result => {
        let expire_date = getUnixtime(result.get("expire"))
        let is_revoked = created_date < expire_date
        if (is_revoked) {
            console.log("token expired: exp(", expire_date, "), created(", created_date, ")")
        }
        done(null, is_revoked)
    }).catch(e => {
        console.log("an error occured")
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

router.post("/upload", upload.single('avatar'), function (req, res, next) {
    console.log("file", req.file)
    console.log("body", req.body)
    res.status(200).json({error: "", message: ""});
})

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
