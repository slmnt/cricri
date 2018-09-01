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
    padding: "20px",
    display: "flex",
    alignContent: "center"
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
    paddingLeft: "10px",
    paddingRight: "10px",
    color: "#00A6FD"
  },
  "@media (max-width: 900px)": {
    menuButton: {
      display: "block",
    }
  }
};

class MobileMenu extends React.Component {
  state = {

  }
  constructor() {

  }
  componentDidMount() {

  }
  render() {
    return (
      <div>
      </div>
    )
  }
}

class Navbar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };
  componentDidMount() {
    
  }
  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <header className={classes.header}>
        <nav className={classes.nav}>
          <div className={classes.logoContainer}>
            <Link to="/"><img src={logo} className={classes.logo} alt="logo" /></Link>
          </div>
          <div className={classes.logo}>
            <input/>
          </div>
          <div className={classes.navButton}>
            探す
          </div>
          <div className={classes.navButton}>
            探す
          </div>
          <div className={classes.navButton}>
            ログイン
          </div>
          <div className={classes.navButton}>
            <Link to="/mypage">
              <AccountCircle className={classes.logo}/>
            </Link>
          </div>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
        </nav>
      </header>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);