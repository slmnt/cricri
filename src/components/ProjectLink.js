import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// import './App.css';

import Test from '../components/Test';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Form from '../components/Form';
import UserLink from './UserLink';

import wallpaper from '../wallpaper-cooperating.jpg';

import api from '../utils/api';

import { setParams, getSearchParams, getRelativePath } from '../utils/misc';


const styles = {
  nav: {
    width: "100%"
  },
  wp: {
    minHeight: "100vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundImage: "url(" + wallpaper + ")",
  },
  topContainer: {
    height: "100vh",
    paddingRight: "20px",
    paddingLeft: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  topItem: {
    width: "40vw"
  },
  form: {
    width: "400px",
    maxWidth: "100%",
    marginTop: "200px"
  },
  flex: {
    paddingRight: "60px",
    paddingLeft: "60px",
    display: "flex",
    flexFlow: "column nowrap",
    alignContent: "center"
  },
  hugeText: {
    marginTop: 200,
    marginBottom: 100,
    fontSize: "100px",
    color: "#FFFFFF"
  },
  searchBox: {
    width: "100%",
    height: "30px",
    fontSize: "25px",
    borderRadius: "3px",
    border: "1px solid #cccccc",
    outline: "0px",
    padding: "10px",
    "&:focus": {
      outline: "1px solid #4da7fe !important"
    }
  },
  center: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "40px",
  },
  showcase: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-around"
  },
  showcaseBlock: {
    marginTop: "80px",
    marginBottom: "80px",
  },
  grad: {
    background: "linear-gradient(145deg, #509cc7, #4d90fe)"
  },
  shadow: {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"
  },
  box: {
    flex: "0 0 auto",
    width: "300px",
    height: "200px",
    marginBottom: "30px",
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    cursor: "pointer",
    transition: "backgroundColor 0.5s",
    border: "none",
    padding: "20px",
    "&:hover": {
      backgroundColor: "#eff5f6"
    }
  },
  boxTitle: {
    fontSize: "30px",
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  boxDesc: {
    fontSize: "20px",
    color: "#cccccc",
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  '@media (max-width: 900px)': {
    form: {
      width: "100vw",
      marginTop: "0px"
    }
  }
};


class ProjectLink extends Component {
  state = {

  }
  onClick = () => {
    this.props.history.push("/projects/" + this.props.projdata.id.toString())
  }
  render () {
    const {classes} = this.props
    return (
      <div className={classNames(classes.box, classes.shadow)} onClick={this.onClick}>
        <div className={classes.boxTitle}>
          {this.props.projdata.name}
        </div>
        <div className={classes.boxDesc}>
          {this.props.projdata.desc}
        </div>
        <img src={this.props.projdata.img} />
      </div>
    )
  }
}
ProjectLink.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withRouter(withStyles(styles)(ProjectLink));
