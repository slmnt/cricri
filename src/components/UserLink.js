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

import Loading from './Loading';
import spinnerImage from '../spinner.jpg';

import api from '../utils/api';
import {mapStateToProps} from '../utils/misc';

const styles = {
    main: {
      height: "50px",
      width: "200px",
      borderRadius: "5px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      padding: "10px",
      display: "flex",
      cursor: "pointer"
    },
    info: {
      paddingLeft: "20px"
    },
    name: {
      fontSize: "17ox"
    },
    shortDesc: {
      fontSize: "20px",
      color: "#cccccc"
    },
    avatar: {
      width: "50px",
      height: "50px"
    },
    avatarImage: {
      width: 47,
      height: 47,
      borderRadius: "5px",
      border: "3px solid #aaaaaa"
    }
};

class UserLink extends React.Component {
    state = {
    };
    componentDidMount() {
    }
    onClick = () => {
      console.log(this.props.userdata)
      this.props.history.push("/users/" + this.props.userdata.id.toString())
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main} onClick={this.onClick}>
            <div className={classes.avatar}>
              <img className={classes.avatarImage} src={spinnerImage} />
            </div>
            <div className={classes.info}>
              <div className={classes.name}>
                {this.props.userdata.name}
              </div>
              <div className={classes.shortDesc}>
                {this.props.userdata.shortDesc}
              </div>
            </div>
          </div>
        );
    }
}
UserLink.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withRouter(withStyles(styles)(UserLink));