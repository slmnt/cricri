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
import TextField from '@material-ui/core/TextField';

import classnames from 'classnames';

import Loading from './Loading';
import spinnerImage from '../spinner.jpg';

import Comment from './Comment';

import {test} from '../actions';
import api from '../utils/api';
import {mapStateToProps} from '../utils/misc';
import { loginUser, logoutUser, getMyInfo, openSignin, openSignup, closeSignin, closeSignup } from '../actions'


const styles = {
    main: {
      padding: "20px",
      paddingTop: "40px",
      paddingRight: "20px",
      paddingLeft: "20px",
      minHeight: "100vh"
    },
    basics: {
      display: "flex",
      justifyContent: "space-around",
      borderBottom: "1px solid #cccccc",
      paddingBottom: "40px"
    },
    name: {
      fontSize: "25px",
      color: "#000000"
    },
    job: {
      fontSize: "15px",
      color: "#cccccc"
    },
    avatar: {
      flex: "0 0 auto",
      width: 200,
      height: 200,
      borderRadius: "10px"
    },
    avatarImage: {
      width: 150,
      height: 150,
    },
    desc: {
      fontSize: "20px",
      color: "#000000",
      paddingRight: "20px",
      paddingLeft: "20px"
    },
    flex: {
      paddingRight: "20%",
      paddingLeft: "20%",
      paddingBottom: "40px",
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "space-between",
    },
    textarea: {
        width: "100%",
        height: "100px"
    },
    commentContainer: {
        paddingTop: "10px",
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between"
    },
    searchBox: {
      width: "90%",
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
    titleText: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      alignText: "center",
      fontSize: "25px"
    },
    buttonContainer: {
      paddingRight: "20%",
      paddingLeft: "20%",
      display: "flex",
      flexFlow: "row-reverse nowrap"
    }
};

class ProjectCreator extends React.Component {
    state = {
      name: "",
      shortDesc: "",
      desc: "",
      mainImg: ""
    };
    componentDidMount() {
    }
    onClickPost = () => {
        var params = {
          name: this.state.name.trim(),
          shortDesc: this.state.shortDesc.trim(),
          desc: this.state.desc.trim(),
        }
        api.createProject(params).then(r => {
            console.log("create project: ", r)
            this.props.history.push("/projects/" + r.id)
        }).catch(e => {
          openSignin()(this.props.dispatch)
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
          <div className={classes.main}>
            <div className={classes.titleText}>
              プロジェクト作成
            </div>
            <div className={classes.flex}>
              <TextField
                  id="name"
                  label="名前"
                  className={classes.textField}
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                  margin="normal"
              />
              <TextField
                  id="shortdesc"
                  label="短い説明"
                  className={classes.textField}
                  value={this.state.shortDesc}
                  onChange={this.handleChange('shortDesc')}
                  margin="normal"
              />
              <TextField
                  id="desc"
                  label="説明"
                  className={classes.textField}
                  value={this.state.desc}
                  onChange={this.handleChange('desc')}
                  multiline
                  rows="10"
                  margin="normal"
              />
            </div>
            <div className={classes.buttonContainer}>
              <Button onClick={this.onClickPost} variant="contained" color="secondary">
                作成
              </Button>
            </div>

          </div>
        );
    }
}
ProjectCreator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(withStyles(styles)(ProjectCreator)));