import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';

import TextField from '@material-ui/core/TextField';

import { loginUser, logoutUser, getMyInfo, test } from '../actions'
import store from '../store';

import api from '../utils/api';


const styles = {
    card: {
        width: "400px",
        height: "450px",
    },
    innerCard: {
      margin : "5%",
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
    },

    main: {
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    overlay: {
        position: "fixed",
        display: "block",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    menu: {
    },
    error: {
        color: "#f5002c",
        fontSize: "15px"
    },
    thanks: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-evenly",
        height: "300px"
    }
};

class Form extends React.Component {
    state = {
        err_msg: "",
        username: "",
        password: ""
    };
    onClickSignup = () => {
        const config = {
          username: this.state.username,
          name: this.state.name,
          password: this.state.password,
          email: this.state.email
        }
        console.log(config)
        api.createUser(config).then(response => {
            console.log(response)
            this.props.close()
            /*
            loginUser(config)(this.props.dispatch).then(r => {
                this.props.history.push("/mypage")
            })
             */
        }).catch(e => {
            console.log(e)
            this.setState({err_msg: "入力内容にエラーがあります"})
        })
    }
    handleChange = name => {
        return event => {
            this.setState({[name]: event.target.value});
        }
    }
    render() {
        const {classes} = this.props;
        return (
            <Card className={classes.card}>
                <div className={classes.innerCard}>
                    <form noValidate autoComplete="off">
                    <Grid container spacing={24} direction="row" justify="center">
                        <Grid item xs={12}>
                            <Typography variant="headline" component="h2" style={{textAlign: "center"}}>
                                    新規会員登録
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.container}>
                            <TextField
                                id="username"
                                label="ユーザ名"
                                className={classes.textField}
                                value={this.state.username}
                                onChange={this.handleChange('username')}
                                margin="normal"
                            />
                            <TextField
                                id="name"
                                label="ニックネーム"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            <TextField
                                type="password"
                                id="password"
                                label="パスワード"
                                className={classes.textField}
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                margin="normal"
                            />
                            <TextField
                                type="email"
                                id="email"
                                label="メールアドレス"
                                className={classes.textField}
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                margin="normal"
                            />
                            </div>
                        </Grid>
                        <Grid item>
                            <Button onClick={this.onClickSignup} variant="outlined" color="primary">
                                会員登録
                            </Button>
                        </Grid>
                    </Grid>
                    </form>
                    <div className={classes.error}>
                        {this.state.err_msg}
                    </div>
                </div>
            </Card>
        );
    }
}
Form.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
Form = connect()(withRouter(withStyles(styles)(Form)));


class Thankyou extends React.Component {
    state = {
    };
    onClickOk = () => {
        //this.props.history.push("/mypage")
        this.props.close()
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.thanks}>
                <div style={{fontSize: "30px"}}>
                    登録完了
                </div>
                <Button onClick={this.onClickOk} variant="contained" color="secondary">
                    閉じる
                </Button>
            </div>
        )
    }
}
Thankyou = withRouter(withStyles(styles)(Thankyou))


class Signup extends React.Component {
    state = {
        showThankyou: false
    };
    componentDidMount() {
        this.setState({showThankyou: false})
    }
    onClick = () => {
        this.props.close()
    }
    onClickMenu = (e) => {
        e.stopPropagation()
    }
    close = () => {
        this.setState({showThankyou: true})        
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.overlay} onClick={this.onClick}>
            <div className={classes.menu} onClick={this.onClickMenu}>
              { this.state.showThankyou &&
                <Thankyou close={this.onClick}/>
                ||
                <Form close={this.close} />
              }
            </div>
          </div>
        );
    }
}
Signup.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default connect()(withStyles(styles)(Signup));