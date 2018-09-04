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
    }
};

class Form extends React.Component {
    state = {
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
        api.createUser(config).then(response => console.log(response));
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
                </div>
            </Card>
        );
    }
}
Form.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
Form = withRouter(withStyles(styles)(Form));



class Signup extends React.Component {
    state = {
    };
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    onClick = () => {
        this.props.close()
    }
    onClickMenu = (e) => {
        e.stopPropagation()
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.overlay} onClick={this.onClick}>
            <div className={classes.menu} onClick={this.onClickMenu}>
              <Form />
            </div>
          </div>
        );
    }
}
Signup.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default connect()(withStyles(styles)(Signup));