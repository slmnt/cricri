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

import UserLink from './UserLink';

import Loading from './Loading';
import spinnerImage from '../spinner.jpg';

import api from '../utils/api';
import {mapStateToProps} from '../utils/misc';

const styles = {
    main: {
      minHeight: "100px",
      minWidth: "200px",
      borderRadius: "5px",
      border: "1px solid #999999",  
      //boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      padding: "10px",
      display: "flex",
      flexFlow: "column nowrap",
    },
    textContainer: {
      whiteSpace: "pre-line",
      flex: "1 1 auto"
    },
    avatarContainer: {
      display: "flex",
      flexFlow: "row-reverse nowrap"
    },
    date: {
      fontSize: "15px",
      color: "#cccccc"
    }
};

class Comment extends React.Component {
  state = {
  }
  render() {
      const {classes} = this.props;
      return (
        <div className={classes.main}>
          <div className={classes.textContainer}>
            {this.props.text}
          </div>
          <div className={classes.avatarContainer}>
            <UserLink userdata={this.props.userdata} />
            <div className={classes.date}>
              {this.props.date}
            </div>
          </div>
        </div>
      );
  }
}
Comment.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Comment)
