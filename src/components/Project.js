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

import api from '../utils/api';

const styles = {
    main: {
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: "100%"
    }
};

class Project extends React.Component {
    state = {
      name: "",
      desc: "",
      owner: {}
    };
    componentDidMount() {
        console.log("Project", this.props)
        window.scrollTo(0, 0)
        this.getData()
    }
    getData() {
      const {params} = this.props.match
      const id = parseInt(params.id, 10)
      console.log("project", id)
      api.getProject(id).then(r => {console.log(r)})
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div>
              Project
              <div>
                  name: {this.props.name}
                  <br />
                  desc: {this.props.descl}
              </div>
            </div>
          </div>
        );
    }
}
Project.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {

    const { auth, retrieve } = state
    const { isAuthenticated, errorMessage } = auth
  
    return {
        isAuthenticated,
        userdata: retrieve && retrieve.userdata
    }
}
  
export default connect(mapStateToProps)(withStyles(styles)(Project));