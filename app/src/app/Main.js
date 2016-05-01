/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import AppBar from 'material-ui/AppBar';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';


import {
  Card,
  CardActions,
  CardHeader,
  CardText
} from 'material-ui/Card';


const styles = {
  container: {
    textAlign: 'center',
  },

  classLocation: {
  },
  classLocationBit: {
    paddingRight: 5
  }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class ClassCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
<Card>
    <CardHeader
      title="Teaching English for Academic Purposes"
      subtitle="Computer Lab"
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      <p>010039</p>
      <p>10am - 1 hour</p>
      <p style={styles.classLocation}>
        <span style={styles.classLocationBit}>CB11</span>
        <span style={styles.classLocationBit}>B1</span>
        <span style={styles.classLocationBit}>403</span>
      </p>
    </CardText>
   
  </Card>
    );
  }
}

 // <CardActions expandable={true}>
 //      <FlatButton label="Action1" />
 //      <FlatButton label="Action2" />
 //    </CardActions>

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
    };
  }

  handleRequestClose() {
  }

  handleTouchTap() {
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <AppBar
          title="Drop In @ UTS"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          />

          <Tabs>
            <Tab label="Nearby" value={0}>
              <div>

              <DropDownMenu value={1} onChange={this.handleChange}>
                <MenuItem value={1} primaryText="B11 (FEIT / cheese grater)"/>
                <MenuItem value={2} primaryText="B8 (brown paper bag)"/>
                <MenuItem value={3} primaryText="B1 (Tower)"/>
              </DropDownMenu>

              <RaisedButton label="Search" primary={true} />

              <h1>12 results</h1>

              <div>

              </div>

              </div>
            </Tab>
            <Tab label="Search" value={1}>
              <div>
              search subjects
              </div>
            </Tab>
          </Tabs>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
