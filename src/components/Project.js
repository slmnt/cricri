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

import UserLink from './UserLink';
import Comment from './Comment';

import Loading from './Loading';
import spinnerImage from '../spinner.jpg';

import api from '../utils/api';
import {mapStateToProps} from '../utils/misc';

const styles = {
    main: {
        paddingTop: "40px",
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    header: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-between"
    },
    name: {
        fontSize: "40px"
    },
    shortDesc: {
        fontSize: "20px",
        color: "#bbbbbb"
    },
    desc: {
        fontSize: "20px",
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: "100%"
    },
    joinBtn: {
        fontSize: "20px",
        width: "300px",
        height: "70px"
    }
};


class Project extends React.Component {
    state = {
      id: null,
      name: "",
      desc: "",
      owner: {},
      comments: []
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
      api.getProject(id).then(r => {
          this.setState({
            id: r.id,
            name: r.name,
            shortdesc: r.shortDesc,
            desc: r.desc,
            owner: r.owner
          })
        })
      api.getProjectComments(id).then(r => {
        this.setState({
            comments: r,
        })
        console.log(r)
      })
    }
    onClickJoin = () => {

    }
    onClickPost = () => {
        if (!this.state.id) {
            return
        }
        const text = this.refs.text.value
        console.log(text)
        api.createProjectComment(this.state.id, {message: text}).then(r => console.log(r))
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div className={classes.header}>
              <div>
                <div className={classes.name}>
                    {this.state.name}
                </div>
                <div className={classes.shortDesc}>
                    {this.state.shortDesc}
                </div>
              </div>
              <div>
                <div>
                    オーナー: <UserLink userdata={this.state.owner} />
                </div>
                <Button className={classes.joinBtn} onClick={this.onClickJoin} variant="contained" color="secondary">
                    参加
                </Button>
              </div>
            </div>
            <div className={classes.desc}>
                {this.state.desc}
            </div>
            <div>
                コメント
                <textarea ref="text">
                </textarea>
                <Button onClick={this.onClickPost} variant="contained" color="secondary">
                    コメント投稿
                </Button>
                {this.state.comments.map(v => <Comment text={v.text} userdata={v.owner} />)}
            </div>
          </div>
        );
    }
}
Project.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default connect(mapStateToProps)(withStyles(styles)(Project));