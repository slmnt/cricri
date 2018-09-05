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
import { loginUser, logoutUser, getMyInfo, openSignin, openSignup, closeSignin, closeSignup, test } from '../actions'

const styles = {
    main: {
        paddingTop: "40px",
        paddingBottom: "40px",
        paddingRight: "var(--main-padding)",
        paddingLeft: "var(--main-padding)",
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
        paddingBottom: "20px",
        whiteSpace: "pre-line"
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: "100%"
    },
    joinBtn: {
        fontSize: "20px",
        width: "300px",
        height: "70px",
        marginTop: "20px"
    },
    textarea: {
        width: "100%",
        height: "100px"
    },
    commentContainer: {
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
        paddingTop: "40px"
    },
    comment: {
        width: "100%",
        paddingBottom: "20px"
    },
    memberContainer: {
        width: "100%",
        display: "flex",
        flexFlow: "row wrap",
    },
    memberBlock: {
        paddingTop: "40px",
        paddingBottom: "40px"
    },
    commentBlock: {
        paddingTop: "40px",
        paddingBottom: "40px"
    },
    blockTitle: {
        fontSize: "25px"
    }
};


class Project extends React.Component {
    state = {
      id: null,
      name: "",
      desc: "",
      owner: {},
      comments: [],
      members: []
    };
    componentDidMount() {
        console.log("Project", this.props)
        window.scrollTo(0, 0)
        this.onRouteChange(this.props.location)
        this.props.history.listen(this.onRouteChange)  
    }
    onRouteChange = (location, action) => {
        if (location.pathname.indexOf("/projects") == 0) {
            this.getData()
        }
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
        console.log("comments", r)
      })
      api.getProjectMembers(id).then(r => {
        this.setState({
            members: r,
        })
        console.log("members", r)
      })
    }
    onClickJoin = () => {
        if (!this.state.id) {
            return
        }
        console.log(this.state)
        api.joinProject(this.state.id).then(r => {
            this.getData()
            console.log(r)
        }).catch(e => {
            this.props.dispatch(openSignin())
        })
    }
    onClickPost = () => {
        if (!this.state.id || this.refs.text.value == "") {
            return
        }
        const text = this.refs.text.value
        console.log(text)
        api.createProjectComment(this.state.id, {message: text}).then(r => {
            console.log(r)
            this.getData()
            this.refs.text.value = ""
        }).catch(e => {
            this.props.dispatch(openSignin())
        })
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
            <div className={classes.memberBlock}>
                <div className={classes.blockTitle}>
                    メンバー
                </div>
                <div className={classes.memberContainer}>
                    {this.state.members.map(v => <UserLink userdata={v} /> )}
                </div>
            </div>
            <div className={classes.commentBlock}>
                <div className={classes.blockTitle}>
                    コメント
                </div>
                <div>
                    <div>
                        <textarea className={classes.textarea} ref="text">
                        </textarea>
                    </div>
                    <div>
                        <Button onClick={this.onClickPost} variant="contained" color="secondary">
                            コメント投稿
                        </Button>
                    </div>
                </div>
                <div className={classes.commentContainer}>
                    {this.state.comments.map(v => <div className={classes.comment}><Comment text={v.message} userdata={v.owner} /> </div> )}
                </div>
            </div>

          </div>
        );
    }
}
Project.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default connect(mapStateToProps)(withStyles(styles)(Project));