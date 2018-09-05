import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';

import { loginUser, logoutUser, getMyInfo, openSignin, openSignup, closeSignin, closeSignup, test } from '../actions'
import {mapStateToProps} from '../utils/misc';


const styles = {
    root: {
        background: "linear-gradient(0deg, #509cc7, #4d90fe)"
    },
    frame: {
        padding: ""
    },
    mainFooterContainer: {
        paddingTop: "60px",
        paddingBottom: "60px",
        height: "300px",
    },
    mainFooter: {
        height: "inherit",
        display: "flex",    
        flexFlow: "column wrap",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    bottomFooter: {
        borderTop: "1px solid #eeeeee",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingRight: "20px",
        paddingLeft: "20px",
        color: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    copyright: {
        fontSize: "13px",
        color: "rgba(255,255,255,.7)",
        paddingRight: "20px"
    },
    smallLink: {
        paddingRight: "10px",
    },
    link: {
        color: "rgba(255,255,255,.7)",
    },
    navBlock: {
        padding: "10px",
        flex: "0 1 auto"
    },
    flexContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    inlineBox: {
        display: "inline-box"
    }
};

var sections = {
    "-について": [],
    "サービス": [],
    "サポート": []
}
var links = [
    ["プライバシーポリシー", "url"]
]
class Footer extends React.Component {
    state = {
    };
    logOut = (e) => {
        e.preventDefault()
        logoutUser()(this.props.dispatch)
    }
    signIn = (e) => {
        e.preventDefault()
        this.props.dispatch(openSignin())
    }
    signUp = (e) => {
        e.preventDefault()
        this.props.dispatch(openSignup())
    }
    render() {
        const {classes} = this.props;
        return (
            <footer className={classes.root}>
                <div className={classes.mainFooterContainer}>
                    <div className={classes.mainFooter}>
                        <div className={classes.navBlock}>
                            <Link to="/"><h4>ホーム</h4></Link>
                        </div>
                        <div className={classes.navBlock}>
                            <Link to="/create"><h4>プロジェクト検索</h4></Link>
                        </div>
                        <div className={classes.navBlock}>
                            <Link to="/search"><h4>ユーザー検索</h4></Link>
                        </div>
                        <div className={classes.navBlock}>
                            <Link to="/explore"><h4>プロジェクト作成</h4></Link>
                        </div>
                        <div className={classes.navBlock}>
                            <Link to="/mypage"><h4>マイページ</h4></Link>
                        </div>
                        {
                            this.props.isAuthenticated &&
                            <a href="/" onClick={this.logOut}>
                                ログアウト
                            </a>
                            ||
                            <React.Fragment>
                                <a href="/" onClick={this.signIn}>
                                    ログイン
                                </a>
                                <a href="/" onClick={this.signUp}>
                                    新規登録
                                </a>
                            </React.Fragment>
                        }
                    </div>
                </div>
                <div className={classNames(classes.bottomFooter, classes.flexContainer)}>
                    <div>
                        <div className={classNames(classes.copyright, classes.inlineBox)}>②2018 CriCri</div>
                        <div className={classNames(classes.inlineBox, classes.smallLink)}><Link className={classes.link} to="/privacy">プライバシーポリシー</Link></div>
                        <div className={classNames(classes.inlineBox, classes.smallLink)}><Link className={classes.link} to="/tos">利用規約</Link></div>
                    </div>
                </div>
            </footer>
        );
    }
}
Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default connect(mapStateToProps)(withStyles(styles)(Footer));