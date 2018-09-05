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

const crypto = require('crypto');

import errors from '../utils/errors'
var mail = require('../utils/mail');



var expiresIn = 3600; //604800; // トークンの有効時間 (秒)  一週間ほど？


function random_hash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('md5').update(current_date + random).digest('hex');
}
function fileFilter(req, file, cb) {
    console.log(file)
    switch (file.mimetype) {
        case "image/jpeg":
        case "image/png":
            cb(null, true)
        default:
            cb(null, false)
    }
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_cfg.upload)
    },
    filename: function (req, file, cb) {
      var h = file.originalname.split(".")
      var filename = random_hash().toString() + "." + h[h.length - 1]
      console.log(h, file)
      cb(null, filename)
    }
})
var upload = multer({ dest: path_cfg.upload, fileFilter: fileFilter, storage: storage })


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
function filename_to_path(filename) {
    return "/upload/" + filename
}
function user_to_object(u) {
    return u.getAvatar().then(avatar => {
        return {
            id: u.id,
            name: u.name,
            shortDesc: u.shortDesc,
            desc: u.desc,
            avatar: avatar && filename_to_path(avatar.filename) || ""
        }
    })
}
function project_to_object(p) {
    return p.getOwner().then(owner => {
        return user_to_object(owner).then(o => {
            return {
                id: p.id,
                name: p.name,
                desc: p.desc,
                owner: {
                    id: o.id,
                    name: o.name,
                    shortDesc: o.shortDesc,
                    avatar: o.avatar,
                }
            }
        })
    })
}
function usermsg_to_object(p) {
    return p.getOwner().then(owner => {
        return user_to_object(owner).then(o => {
            return {
                id: p.id,
                message: p.message,
                owner: {
                    id: o.id,
                    name: o.name,
                    shortDesc: o.shortDesc,
                    avatar: o.avatar,
                }
            }
        })
    })
}
function projectmsg_to_object(p) {
    return p.getOwner().then(owner => {
        return user_to_object(owner).then(o => {
            return {
                id: p.id,
                message: p.message,
                owner: {
                    id: o.id,
                    name: o.name,
                    shortDesc: o.shortDesc,
                    avatar: o.avatar,
                }
            }
        })
    })
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
            return result
        }
    )
}
function get_project_by_id(id) {
    return models.Project.findById(id).catch(err => {
        console.log("Error [get_project_by_id()]: ", param, err)
    }).then(result => {
            if (result === undefined) {
                throw new errors.ProjectNotFound("")
            }
            if (result === null) {
                throw new errors.TableNotFound("")
            }
            return result
        }
    )
}
function promise_all(array, func) {
    var proj = []
    var parray = array.map(p => func(p).then(r => {
        proj.push(r)
    }))
    return Promise.all(parray).then(r => {
        return proj
    })
}

function search_query_to_object(q) {
    if (!q || Object.keys(q).length === 0) {
        return {}
    }
    var {q, s, p, l} = q // query, sort, page, limit
    p = p && parseInt(p)
    l = l && parseInt(l) || 10 // デフォルトで 10
    var param = {}
    if (q) {
        param.where = {
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
    return param
}
function search_user(query, count=false) {
    var param = search_query_to_object(query)
    if (count) {
        delete param.limit
        delete param.offset
    }

    return models.User[count && "count" || "findAll"](param)
    .catch(err => {
        console.log("Error [search_user()]: ", err)
    }).then(result => {
            if (result === undefined) {
                throw new errors.UserNotFound("")
            }
            if (result === null) {
                throw new errors.TableNotFound("")
            }
            if (count) {
                return result
            } else {
                return result
            }
        }
    )
}
function search_project(query, count=false) {
    var param = search_query_to_object(query)
    if (count) {
        delete param.limit
        delete param.offset
    }

    return models.Project[count && "count" || "findAll"](param)
    .catch(err => {
        console.log("Error [get_project()]: ", err)
    }).then(result => {
            if (result === undefined) {
                throw new errors.ProjectNotFound("")
            }
            if (result === null) {
                throw new errors.TableNotFound("")
            }
            if (count) {
                return result
            } else {
                return promise_all(result, project_to_object)
            }
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
            var {username, name, password, email} = req.body;
            // 認証
            models.User.create({
                username: username,
                name: name,
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
                return user_to_object(result).then(r => {
                    console.log(r);
                    res.send(r);
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // ユーザ検索
        method: "get", url: "/users", auth: false,
        func: function (req, res) {
            var {query} = url.parse(req.url, true)
            search_user(query, true).then(count => {
                search_user(query).then(result => {
                    return promise_all(result, user_to_object).then(r => {
                        res.send({
                            count: count,
                            items: r
                        });
                    })
                }).catch(e => {
                    console.log(e)
                    response(res, 400, e)
                })
            })
        }
    },
    {
        // 自分の情報を更新
        method: "put", url: "/me", auth: true,
        func: function (req, res) {
            var {name, avatar} = req.body;
            get_user({username: req.user.username}).then(result => {
                var obj = {}
                if (avatar) {
                    obj.avatar = avatar
                }
                result.update(obj)
            }).catch(e => {
                console.log(e)
                response(res, 400, e)
            })
        }
    },
    {
        // 自分の情報を取得
        method: "get", url: "/me", auth: true,
        func: function (req, res) {
            get_user({username: req.user.username}).then(result => {
                return user_to_object(result).then(r => {
                    res.status(200).json(r)
                })
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
            console.log("/projects", query)
            search_project(query, true).then(count => {
                search_project(query).then(result => {
                    res.send({
                        count: count,
                        items: result
                    });
                }).catch(e => {
                    console.log(e)
                    response(res, 400, e)
                })
            })
        }
    },
    {
        // プロジェクト取得
        method: "get", url: "/projects/:id", auth: false,
        func: function (req, res) {
            console.log("/projects/:id", req.params.id)
            get_project({id: req.params.id}).then(result => {
                return project_to_object(result).then(r => res.send(r));
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
                        user.addProjMsg(projectMsg)
                        projectMsg.setOwner(user)
                        project.addMsg(projectMsg)
                        projectMsg.setPlace(project)
                        res.json({ok: true})
                    })
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // プロジェクトメッセージ（コメント）取得
        method: "get", url: "/projects/:id/comments", auth: false,
        func: function (req, res) {
            var {query} = url.parse(req.url, true)
            var params = search_query_to_object(query)
            params.id = req.params.id
            get_project(params).then(project => {
                project.getMsgs({
                    order: [
                        ["updatedAt", 'DESC'],
                    ]
                }).then(r => {
                    console.log(r);
                    return promise_all(r, projectmsg_to_object).then(result => res.send(result));
                })
            })
        }
    },
    {
        // ユーザメッセージ（コメント）作成
        method: "post", url: "/users/:id/comments", auth: true,
        func: function (req, res) {
            var {username} = req.user
            var {message} = req.body
            get_user({username}).then(user => {
                get_user({id: req.params.id}).then(target => {
                    models.UserMsg.create({
                        message: message,
                    }).then(UserMsg => {
                        console.log(UserMsg)
                        UserMsg.setOwner(user)
                        UserMsg.setPlace(target)
                        user.addUserMsg(UserMsg)
                        target.addMsg(UserMsg)
                        res.json({ok: true, message: "success"})
                    })
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // ユーザメッセージ（コメント）取得
        method: "get", url: "/users/:id/comments", auth: false,
        func: function (req, res) {
            var {query} = url.parse(req.url, true)
            var params = search_query_to_object(query)
            params.id = req.params.id
            get_user(params).then(user => {
                user.getMsgs({
                    order: [
                        ["updatedAt", 'DESC'],
                    ]
                }).then(r => {
                    console.log(r);
                    return promise_all(r, usermsg_to_object).then(result => res.send(result));
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // プロジェクトに参加
        method: "post", url: "/projects/:id/members", auth: true,
        func: function (req, res) {
            var {username} = req.user
            get_user({username}).then(user => {
                get_project({id: req.params.id}).then(project => {
                    project.addMember(user)
                    res.json({ok: true})
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // プロジェクトのメンバを取得
        method: "get", url: "/projects/:id/members", auth: false,
        func: function (req, res) {
            var {query} = url.parse(req.url, true)
            var params = search_query_to_object(query)
            params.id = req.params.id
            get_project(params).then(project => {
                return project.getMembers().then(result => {
                    return promise_all(result, user_to_object).then(r => res.json(r))
                })
            }).catch(e => {
                response(res, 400, e)
            })
        }
    },
    {
        // 画像アップロード
        method: "post", url: "/upload", auth: true, form: "avatar",
        func: function (req, res) {
            var {username} = req.user
            var filename = req.file.filename

            get_user({username}).then(user => {
                console.log(req.file, req.files)
                models.Image.create({
                    filename: filename,
                }).then(image => {
                    user.setAvatar(image)
                    res.status(200).json({
                        path: filename_to_path(filename),
                    });
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
    var args = []
    if (a.auth) {
        args.push(ejwt({secret: secret, isRevoked: isRevoked}))
    }
    if (a.form) {
        args.push(upload.single(a.form))
    }
    args.push(a.func)
    if (a.auth) {
        args.push(errorHandler)
    }
    router[a.method](a.url, ...args)
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
