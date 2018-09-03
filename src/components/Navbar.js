import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
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

import {openSignin, openSignup, closeSignin, closeSignup} from '../actions';
import store from '../store';
import {mapStateToProps} from '../utils/misc';

import MobileMenu from './MobileMenu';

const styles = {
  root: {
  },
  menuButton: {
    display: "none",
    height: "20px",
  },
  logo: {
    height: "20px",
  },
  nav: {
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "20px",
    paddingRight: "20px",
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },
  header: {
    borderBottom: "1px solid rgba(46,62,72,.12)"
  },
  logoContainer: {
    flex: "1 1 auto"
  },
  navMenu: {
    flex: "0 1 auto"
  },
  navButton: {
    height: "24px",
    paddingLeft: "10px",
    paddingRight: "10px",
    color: "#000000",
    backgroundColor: "#FFFFFF",
    border: "0px",
    "&:hover": {
      color: "#00A6FD",
      cursor: "pointer"
    }
  },
  "@media (max-width: 900px)": {
    menuButton: {
      display: "block",
    },
    navButton: {
      display: "none"
    },
    nav: {
      justifyContent: "center",
    }
  }
};

class Navbar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };
  componentDidMount() {
  }
  onClickMenuButton = (e) => {
    this.toggleMobileMenu()
  }
  toggleMobileMenu = () => {
    if (this.state.showMobileMenu) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  }
  openMobileMenu = () => {
    this.setState({showMobileMenu: true})
  }
  closeMobileMenu = () => {
    this.setState({showMobileMenu: false})
  }
  setLocation = path => () => {
    this.props.history.push(path);
  }
  openSignin = () => {
    this.props.dispatch(openSignin())
  }
  openSignup = () => {
    this.props.dispatch(openSignup())
  }
  render() {
    const { classes } = this.props;
    const { loggedIn, username } = this.state;

    return (
      <header className={classes.header}>
        <nav className={classes.nav}>
          <div className={classes.logoContainer}>
            <Link to="/"><img src={logo} className={classes.logo} alt="logo" /></Link>
          </div>
          <div className={classes.logo}>
            <input/>
          </div>
          <div className={classes.navButton} onClick={this.setLocation('/explore')}>
            探す
          </div>
          <div className={classes.navButton} onClick={this.setLocation('/explore')}>
            探す
          </div>
          {
            this.props.isAuthenticated &&
            <div className={classes.navButton} onClick={this.setLocation('/mypage')}>
              <AccountCircle className={classes.logo}/>
            </div>
            ||
            <React.Fragment>
              <div className={classes.navButton} onClick={this.openSignin}>
                ログイン
              </div>
              <div className={classes.navButton} onClick={this.openSignup}>
                登録
              </div>
            </React.Fragment>
          }
          <IconButton className={classes.menuButton} onClick={this.onClickMenuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          {this.state.showMobileMenu && <MobileMenu closeMobileMenu={this.closeMobileMenu}/>}
        </nav>
      </header>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Navbar)));