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

import UserLink from './UserLink';
import Comment from './Comment';

import {test} from '../actions';
import api from '../utils/api';
import {mapStateToProps} from '../utils/misc';
import {loginUser, logoutUser, getMyInfo, openSignin, openSignup, closeSignin, closeSignup} from '../actions';

import axios from 'axios';

import {Edit, Close} from '@material-ui/icons';


const styles = {
    main: {
      padding: "20px",
      paddingTop: "40px",
      paddingRight: "20px",
      paddingLeft: "20px",
      minHeight: "100vh"
    },
    basics: {
      minHeight: "230px",
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
      borderRadius: "5px",
      border: "3px solid #aaaaaa"
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
    comment: {
        width: "100%",
        paddingBottom: "20px"
    },
    commentBlock: {
      paddingTop: "40px",
      paddingBottom: "40px"
    },
    blockTitle: {
        fontSize: "25px"
    },
    editable: {
      display: "flex",
      flexFlow: "row nowrap"
    },
    editableIcon: {
      cursor: "pointer"
    },
    editableIconContainer: {
      display: "flex",
      alignItems: "center"
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
};

class EditableText extends React.Component {
  state = {
    edit: false
  }
  componentDidMount() {

  }
  onEdit = () => {
    this.setState({edit: true})
    this.props.onOpen()
  }
  onClose = () => {
    this.props.onClose()
    this.setState({edit: false})
  }
  render() {
    const {classes} = this.props
    return (
      <div className={classes.editable}>
        <div style={{width: this.props.rWidth || "auto"}}>
          {this.props.children[this.props.enable && this.state.edit && 1 || 0]}
        </div>
        { this.props.enable && 
          <div className={classes.editableIconContainer}>
            {this.state.edit &&
            <Close className={classes.editableIcon} onClick={this.onClose}/>
            ||
            <Edit className={classes.editableIcon} onClick={this.onEdit}/>}
          </div>
        }
      </div>
    )
  }
}
EditableText.propTypes = {
  classes: PropTypes.object.isRequired,
};
EditableText = withStyles(styles)(EditableText);



class User extends React.Component {
    state = {
      id: null,
      username: "",
      name: "",
      shortdesc: "",
      desc: "",
      email: "",
      avatar: "",
      spinner: true,
      comments: []
    }
    dummy = {
      id: null,
      username: "will.will.s",
      name: "Will Willson",
      shortdesc: "Ph.D in Computer Retardation",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      email: "a@com",
      avatar: spinnerImage,
      spinner: true,
      comments: []
    };
    constructor(props) {
      super(props);
      this.nameRef = React.createRef();
      this.shortDescRef = React.createRef();
      this.descRef = React.createRef();
    }
    componentDidMount() {
      window.scrollTo(0, 0);
      this.getData();
      this.form = React.createRef();
    }
    getData() {
      var {params} = this.props.match;
      var id = parseInt(params.id, 10);
      var hasId = params.id;
      (!hasId && api.getMyInfo() || api.getUser(id)).then(r => {
        this.setState({
          id: r.id,
          username: r.username,
          name: r.name,
          shortdesc: r.shortDesc,
          desc: r.desc,
          avatar: r.avatar,
        })
        return r.id
      }).then(id => {
        api.getUserComments(id).then(r => {
          this.setState({
              comments: r,
          })
        })
      }).catch(e => {
        this.setState(this.dummy)
      })
    }
    onClickPost = () => {
        if (!this.state.id) {
            return
        }
        const text = this.refs.text.value
        api.createUserComment(this.state.id, {message: text}).then(r => {
            this.getData()
        }).catch(e => {
          this.props.dispatch(openSignin())
        })
    }
    isMe = () => {
      return this.state.id && this.props.userdata && this.state.id.toString() == this.props.userdata.id.toString()
    }
    test = () => {
      var formData = new FormData(this.form.current);
      console.log(formData.get('avatar'))
      /*
      axios.post('/api/upload', formData)
      .then(() => {
        console.log('success');
      })
      .catch((err) => {
        console.error(err);
      });
      fetch("/api/upload", {
        method: "post",
        body: formData
      }).then(r => {
        console.log(r)
      })
      */
      api.upload(formData).then(r => {
        console.log(r)
        this.getData()
      })
    }
    onClickSignout = () => {
      if (!this.props.isAuthenticated) {
        return
      }
      logoutUser()(this.props.dispatch).then(r => {
        this.props.history.push("/")
      })
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div className={classes.basics}>
              <div className={classes.avatar}>
                <img className={classes.avatarImage} src={this.state.avatar} />
                { this.isMe() &&
                  <React.Fragment>
                    <div>
                      <form ref={this.form} id="myForm" name="myForm">
                        <input type="file" id="avatar" name="avatar" ref="input" />
                      </form>
                      <button onClick={this.test}>決定</button>
                    </div>
                    <Button onClick={this.onClickSignout} variant="outlined" color="primary">
                      ログアウト
                    </Button>
                  </React.Fragment>
                }
              </div>
              <div className={classes.flex}>
                  <div className={classes.name}>
                    {this.state.name}
                  </div>
                <div className={classes.job}>
                  {this.state.shortdesc}
                </div>
              </div>
            </div>
            <div className={classes.desc}>
              {this.state.desc}
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
User.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(User));