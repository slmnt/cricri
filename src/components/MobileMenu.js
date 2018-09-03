import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import logo from '../logo.png';

import store from '../store';

const styles = {
  overlay: {
    position: "fixed",
    display: "block",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 2,
    cursor: "pointer",
  },
  menu: {
    position: "fixed",
    width: "var(--mobile-menu-width)",
    height: "100vh",
    top: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 3,
    cursor: "auto",
    transition: "right 1s",
    animationDuration: "0.5s",
    animationName: "slidein",
  },
  main: {
    display: "flex",
    flexFlow: "column nowrap",
    padding: "10px",
    paddingTop: "40px"
  },
  item: {
    width: "100%",
    height: "20px",
    flex: "0 0 auto",
    cursor: "auto",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: "background-color 0.4"
    }
  },
  "@keyframes slidein": {
    from: {
      right: "calc(-1 * var(--mobile-menu-width))"
    },
    to: {
      right: 0
    }
  }
};


class MobileMenu extends React.Component {
  state = {

  }
  componentDidMount() {

  }
  onClickOverlay = (e) => {
    this.props.closeMobileMenu()
  }
  onClickMenu = (e) => {
    e.stopPropagation()
  }
  render() {
    const {classes} = this.props
    return (
      <div className={classes.overlay} onClick={this.onClickOverlay}>
        <div className={classes.menu} onClick={this.onClickMenu}>
          <div className={classes.main}>
            <div className={classes.item}>
              ホーム
            </div>
            <div className={classes.item}>
              検索
            </div>
            <div className={classes.item}>
              ログイン
            </div>
            <div className={classes.item}>
              ログアウト
            </div>
          </div>
        </div>
      </div>
    )
  }
}
MobileMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MobileMenu);
