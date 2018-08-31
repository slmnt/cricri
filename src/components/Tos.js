import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = {
    main: {
      paddingRight: "20px",
      paddingLeft: "20px",
    },
    title: {
      textAlign: "center"
    }
};

class Tos extends React.Component {
    state = {
    };
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.main}>
              <div>
                <div className={classes.title}><h1>利用規約</h1></div>
                <div>
                  <p>お客様は、本サービスの利用について全面的に責任を負います。</p>
                  <p>お客様に人的損害または損失がもたらされた場合、CriCri®™ はいかなる場合においても当該損失について責任を負わないものとします。</p>
                  <br />
                  <p>本利用規約の成立、実施、および解釈、ならびに本利用規約に関する紛争の解決は、中華人民共和国の法律に準拠します。</p>
                </div>
              </div>
            </div>
        );
    }
}
Tos.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Tos);