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
import { setParams, getSearchParams, getRelativePath } from '../utils/misc';

import Loading from './Loading';

const styles = {
  main: {
    padding: "20px",
    paddingTop: "40px",
    minHeight: "100vh"
  },
  shadow: {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"
  },
  center: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  title: {
    textAlign: "center",
    fontSize: "25px"
  },
  searchBox: {
    width: "60%",
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
  notFound: {
    alignText: "center"
  },
  pagination: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingLeft: "30%",
    paddingRight: "30%"
  },
  pageButton: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "40px",
    height: "40px",
    textAlign: "center",
    lineHeight: "40px",
    flex: "0 1 auto",
    cursor: "auto",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#00A6FD"
    }
  },
  pageButtonCurrent: {
    cursor: "default",
    backgroundColor: "#606d79"
  },
  pageLink: {
    color: "#000000",
    "&:hover": {
      cursor: "pointer",
      color: "#00A6FD"
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
    marginBottom: "30px",
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    cursor: "pointer",
    transition: "backgroundColor 0.5s",
    border: "none",
    padding: "1px",
    "&:hover": {
      backgroundColor: "#eff5f6"
    }
  },
  boxTitle: {
    fontSize: "30px"
  },
  boxDesc: {
    fontSize: "20px",
    color: "#cccccc"
  },
  '@media (max-width: 900px)': {
    pagination: {
      paddingLeft: "20px",
      paddingRight: "20px"
    }
  }
}

class Box extends React.Component {
  state = {};
  render() {
    const {classes} = this.props
    return (
      <div className={classNames(classes.box, classes.shadow)} onClick={this.props.onClickClbk}>
        <div className={classes.boxTitle}>
          {this.props.title}
        </div>
        <div className={classes.boxDesc}>
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
      <div className={classNames(classes.pageButton, classes.shadow, this.props.isSelected && classes.pageButtonCurrent)} onClick={this.onClick}>
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
    pages: [1, 2, 3, 4, 5, 6, 7],
    people: [],
    projects: []
  };
  componentDidMount() {
    this.onRouteChange(this.props.location)
    this.props.history.listen(this.onRouteChange)
  }
  onRouteChange = (location, action) => {
    var params = url.parse(location.search, true).query
    if (!this.state.fetching) {
      let from = Math.max(1, params.p - this.state.pages.length / 2 + 1)
      this.setState({pageFrom: from || 1})
    }
    
    if (this.refs.search_box) {
      this.refs.search_box.value = params.q || ""
    }
    this.getData(params)
  }
  getData(params) {
    if (this.state.fetching) {
      return
    }
    this.state.fetching = true
    var {q, s, p, l} = params
    api.searchProjects(params).then(result => {
      this.setState({
        count: result.count,
        projects: result.items
      })
    }).catch(e => {}). then(r => {
      this.state.fetching = false
    })
  }
  onClickPageBtn = (path) => {
    this.props.history.push(path)
  }
  onKeyPress = (e) => {
    if (e.key == 'Enter') {
      this.search(this.refs.search_box.value.trim())
    }
  }
  search = (text) => {
    var path = getRelativePath(setParams(this.props.history.location, {q: text, p: 1}))
    this.props.history.push(path)
  }
  getLink(num) {
    if (num < 1) {
      num = 1
    }
    var new_url = setParams(this.props.history.location, {p: num})
    return getRelativePath(new_url)
  }
  goTo = (num) => {
    var sp = getSearchParams(this.props.history.location)
    var path = this.getLink(parseInt(sp.get("p")) + num)
    this.onClickPageBtn(path)
  }
  goToNext = () => {
    this.goTo(1)
  }
  goToPrev = () => {
    this.goTo(-1)
  }
  isSelected(num) {
    var sp = getSearchParams(this.props.history.location)
    return sp.get('p') == num.toString()
  }
  openProj = (id) => {
    return () => {
      var path = "/projects/" + id.toString()
      this.props.history.push(path)
    }
  }
  render() {
    const {classes} = this.props
    return (
      <div className={classes.main}>
        <div className={classes.center}>
          <div className={classes.title}>
            プロジェクトを検索
          </div>
          <input onKeyPress={this.onKeyPress} className={classes.searchBox} ref="search_box"></input>
        </div>
        <div className={classes.center}>
          <Loading enable={this.state.projects.length == 0}>
            <div className={classes.boxContainer}>
              {
                this.state.projects.map(v => <Box id={v.id} title={v.name} desc={v.desc} onClickClbk={this.openProj(v.id)}/>)
              }
            </div>
          </Loading>
          {this.state.projects.length == 0 &&
            <div className={classes.notFound}>プロジェクトが見つかりません</div>
          }
        </div>
        <div className={classes.pagination}>
          <div className={classes.pageLink}>
            <a onClick={this.goToPrev}>前へ</a>
          </div>
          {
          this.state.pages.map(v => {
            var page = parseInt(this.state.pageFrom) + parseInt(v) - 1
            var max_page = Math.ceil(this.state.count / this.state.pages.length)
            return page <= max_page && <PageButton key={v} num={page} link={this.getLink(page)} isSelected={this.isSelected(page)} callback={this.onClickPageBtn} />
              || false
          })
          }
          <div className={classes.pageLink}>
            <a onClick={this.goToNext}>次へ</a>
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Explore);