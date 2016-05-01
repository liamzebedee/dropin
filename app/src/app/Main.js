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


import TextField from 'material-ui/TextField';



import {List, ListItem} from 'material-ui/List';

// import ActionInfo from 'material-ui/lib/svg-icons/action/info';
// import Divider from 'material-ui/lib/divider';
// import Subheader from 'material-ui/lib/Subheader';
// import ActionAssignment from 'material-ui/lib/svg-icons/action/assignment';
// import {blue500, yellow600} from 'material-ui/lib/styles/colors';

import SelectField from 'material-ui/SelectField';

import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
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

class SubjectCard extends React.Component {
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
        <List>
          <ListItem
            primaryText="Monday 11am"
            secondaryText="Seminar in CB05.04.039 - 1hr"
          />
          <ListItem
            primaryText="Monday 2pm"
            secondaryText="Lecture in CB05.04.039 - 2.5hr"
          />
        </List>
      </CardText>
    </Card>
    );
  }
}

 // <CardActions expandable={true}>
 //      <FlatButton label="Action1" />
 //      <FlatButton label="Action2" />
 //    </CardActions>

class ResultsSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var note = this.props.results.length > 0 ? <h1>{this.props.results.length + ' results!'}</h1> : null;
    return (
      <div>
        {note}

        <div>
          {this.props.results.map(this.props.renderItem)}
        </div>
      </div>
    );
  }
}

const UTSBuildings = `
B11 - B11 (FEIT / cheese grater)
B8 - B8 (brown paper bag)
B1 - B1 (Tower)
`.split('\n').filter((item) => !!item).map((item) => {
  const [code, text] = item.split(' - ');
  return { code, text };
});
console.log(UTSBuildings)

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.searchNearby = this.searchNearby.bind(this);
    this.searchSubjectsByText = this.searchSubjectsByText.bind(this);

    this.state = {
      searchNearbyResults: [1,2,3],
      buildingQuery: UTSBuildings[0].code,

      searchByTextQuery: '',
      searchByTextResults: [1,1,1,1,1,1,1]
    };
  }

  searchNearby() {

  }

  searchSubjectsByText() {

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
          title="Drop In @ UTS"/>

          <Tabs>
            <Tab label="Nearby" value={0}>
              <div>

              <DropDownMenu value={this.state.buildingQuery} onChange={(event, index, value) => this.setState({ buildingQuery: value })}>
                {UTSBuildings.map((item, i) => <MenuItem key={i} value={item.code} primaryText={item.text}/>)}
              </DropDownMenu>

              <RaisedButton label="Search" primary={true} onClick={this.searchNearby}/>

              <ResultsSection results={this.state.searchNearbyResults} renderItem={(item) => <ClassCard {...item}/>}/>

              </div>
            </Tab>


            <Tab label="Search" value={1}>
              <div>
                <TextField
                  hintText="Keywords, subject code, etc." onChange={(ev) => this.setState({ searchByTextQuery: ev.target.value })} value={this.state.searchByTextQuery}/>
                <RaisedButton label="Search" primary={true} onClick={this.searchSubjectsByText}/>


                <ResultsSection results={this.state.searchByTextResults} renderItem={(item) => <SubjectCard {...item}/>}/>

              </div>
            </Tab>
          </Tabs>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default Main;
