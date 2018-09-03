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
import url from 'url';

import api from '../utils/api';
import misc from '../utils/misc';

import Loading from './Loading';

const styles = {
  shadow: {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"
  },
  pagination: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "20%",
    paddingRight: "20%",
  },
  pageButton: {
    color: "#cccccc",
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "40px",
    height: "40px",
    textAlign: "center",
    lineHeight: "40px",
    flex: "0 0 auto",
    cursor: "auto",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#00A6FD"
    }
  },
  boxContainer: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
    alignContent: "center",
    padding: "var(--main-padding)"
  },
  box: {
    flex: "0 0 auto",
    width: "300px",
    height: "200px",
    margin: "0px",
    borderRadius: "5px",
    backgroundColor: "#223833",
    textAlign: "center",
  },
  title: {
    fontSize: "30px"
  },
  desc: {
    fontSize: "20px",
    color: "#cccccc"
  }
}

class Box extends React.Component {
  state = {};
  render() {
    const {classes} = this.props
    return (
      <div className={classNames(classes.box, classes.shadow)}>
        <div className={classes.title}>
          {this.props.title}
        </div>
        <div className={classes.desc}>
          {this.props.desc}
        </div>
        <img src={this.props.img} />
      </div>
    );
  }
}

Box.propTypes = {
  classes: PropTypes.object.isRequired,
};

Box = withStyles(styles)(Box);




class PageButton extends React.Component {
  state = {};
  onClick = () => {
    if (!this.props.isSelected) {
      this.props.callback(this.props.link)
    }
  }
  render() {
    const {classes} = this.props
    return (
      <div className={classNames(classes.pageButton, classes.shadow)} onClick={this.onClick}>
        {this.props.num}
      </div>
    )
  }
}
PageButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

PageButton = withStyles(styles)(PageButton);



class Explore extends React.Component {
  state = {
    fetching: false,
    pageFrom: 1,
    pages: [1, 2, 3, 4, 5, 6],
    people: [],
    projects: []
  };
  componentDidMount() {
    this.update(this.props.history.location.search)
  }
  getData(params) {
    if (this.state.fetching) {
      return
    }
    this.state.fetching = true
    var {q, s, p, l} = params
    api.searchProjects(params).then(result => {
      this.setState({
        projects: result
      })
    }).catch(e => {}). then(r => {
      this.state.fetching = false
    })
  }
  onClick = () => {

  }
  onClickCallback = (path) => {
    this.props.history.push(path)
    this.update(path)
  }
  update = (path) => {
    var params = url.parse(path, true).query
    if (!this.state.fetching) {
      this.setState({pageFrom: params.p || 1})
    }
    this.getData(params)
  }
  search = () => {
    var new_url = misc.setParams(this.props.history.location, {p: 1})
    this.props.history.push(new_url.href)
  }
  getLink(num) {
    var new_url = misc.setParams(this.props.history.location, {p: num})
    return misc.getRelativePath(new_url)
  }
  isSelected(num) {
    var sp = misc.getSearchParams(this.props.history.location)
    console.log(sp.get('p'), num.toString(), sp.get('p') == num.toString())
    return sp.get('p') == num.toString()
  }
  render() {
    const {classes} = this.props
    return (
      <div>
        <input ref="search_box"></input>
        <button onClick={this.onClick}>s</button>
        <div>
          人
        </div>
        <div>
        </div>

        <div>
          プロジェクト
          <Link to="/explore?q=a&s=name&p=1&l=3">click</Link>
        </div>
        <Loading enable={this.state.projects.length == 0}>
          <div className={classes.boxContainer}>
            {
              this.state.projects.map(v => <Box id={v.id} title={v.name} desc={v.desc} />)
            }
          </div>
          <div className={classes.pagination}>
            {
            this.state.pages.map(v => {
              var page = parseInt(this.state.pageFrom) + parseInt(v) - 1
              return <PageButton key={v} num={page} link={this.getLink(page)} isSelected={this.isSelected(page)} callback={this.onClickCallback} />
            })
            }
          </div>
        </Loading>
      </div>
    );
  }
}

Explore.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Explore);