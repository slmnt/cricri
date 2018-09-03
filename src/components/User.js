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

import Loading from './Loading';
import spinnerImage from '../spinner.jpg';

import {test} from '../actions';
import api from '../utils/api';
import {mapStateToProps} from '../utils/misc';


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
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "center"
    }
};

class User extends React.Component {
    state = {
        username: "Will Willson",
        shortdesc: "Ph.D in Computer Retardation",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        email: "ww@aws",
        avatar: "",
        spinner: true,
    };
    componentDidMount() {
        console.log("User", this.props)
        window.scrollTo(0, 0)
        if (this.props.me) {
          this.setState({
            username: this.props.userdata.username,
            shortdesc: this.props.userdata.shortDesc,
            desc: this.props.userdata.desc,
            avatar: this.props.userdata.avatar,
          })
        } else {
          this.getData()
        }
    }
    getData() {
      const {params} = this.props.match
      const id = parseInt(params.id, 10)
      console.log("user", id)
      api.getUser(id).then(r => {
        this.setState({
          username: r.username,
          shortdesc: r.shortDesc,
          desc: r.desc,
          avatar: r.avatar,
        })
      })
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div className={classes.basics}>
              <div className={classes.avatar}>
                <img className={classes.avatarImage} src={spinnerImage} />
                <form action="/api/upload" method="post" enctype="multipart/form-data">
                  <input type="file" name="avatar" />
                  <input type="submit" value="Save"></input>
                </form>
              </div>
              <div className={classes.flex}>
                <div className={classes.name}>
                  {this.state.username}
                </div>
                <div className={classes.job}>
                  {this.state.shortdesc}
                </div>
              </div>
            </div>
            <div className={classes.desc}>
              {this.state.desc}
            </div>
          </div>
        );
    }
}
User.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(User));