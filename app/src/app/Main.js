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

import Paper from 'material-ui/Paper';


import {List, ListItem} from 'material-ui/List';



import SelectField from 'material-ui/SelectField';

import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardText
} from 'material-ui/Card';

import UTSSubjects from './subjects.json';

function getSubjectNameForCode(code) {
  var name = '';
  UTSSubjects.forEach((subj) => {
    if(subj.subjectCode == code) name = subj.subjectName;
  })
  return name;
}
function getSubjectCodeForName(name) {
  var code = '';
  UTSSubjects.forEach((subj) => {
    if(subj.subjectName == name) code = subj.subjectCode;
  })
  return code;
}


var moment = require('moment');


// var PouchDB = require('pouchdb');
// PouchDB.plugin(require('pouchdb-load'));
var UTSTimetable = require('./timetable.json');



    const ClassTypes = {
      "CNR": "Class Not Required",
      "CMP": "Computer Lab",
      "DRP": "Drop in",
      "LAB": "Laboratory",
      "LEC": "Lecture",
      "PRC": "Practical or Practicum session",
      "SEM": "Seminar",
      "STU": "Studio",
      "TUT": "Tutorial",
      "UPS": "U:PASS session",
      "WRK": "Workshop"
    };


const styles = {
  container: {
  },

  classLocation: {
  },
  classLocationBit: {
    paddingRight: 5,
    fontWeight: 600
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
    var classType = ClassTypes[this.props.classType.toUpperCase()];

    const theHour = moment({hours: this.props.hour}).format('ha');
    

    return (
    <Card>
      <CardHeader
        title={this.props.subjectName}
        subtitle={classType}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <p>{this.props.subjectCode}</p>
        <p>{theHour} - {this.props.howLong} mins</p>
        <p style={styles.classLocation}>
          <span style={styles.classLocationBit}>{this.props.building}</span>
          <span style={styles.classLocationBit}>{this.props.level}</span>
          <span style={styles.classLocationBit}>{this.props.room}</span>
        </p>
      </CardText>
    </Card>
    );
  }
}

class SubjectCard extends React.Component {
  render() {
    this.props.classes.sort((a, b) => {
      return a.day - b.day;
    })


    return (
    <Card>
      <CardHeader
        title={this.props.subjectName}
        subtitle={this.props.subjectCode}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <List>
          {this.props.classes.map((subjectClass) => {
            var dateNice = moment({
              hours: subjectClass.hour
            }).isoWeekday(subjectClass.day).format('dddd ha');

            var classType = ClassTypes[subjectClass.classType.toUpperCase()];

            return <ListItem
              primaryText={dateNice}
              secondaryText={classType + " in " + subjectClass.location.join('.') + " - " + `${subjectClass.howLong}mins`}
            />;
          })}
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
    var note = this.props.results.length > 0 ? <h2 style={{paddingLeft:15,paddingTop:10}}>{this.props.results.length + ' ' + this.props.unitOfMeasurement + '!'}</h2> : null;
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
CB11: B11 (FEIT / cheese grater)
CB08: B8 (brown paper bag)
CB01: B1 (Tower)
`.split('\n').filter((item) => item).map((item) => {
  const [code, text] = item.split(': ');
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
      searchNearbyResults: [],
      buildingQuery: UTSBuildings[0].code,

      searchByTextQuery: '',
      searchByTextResults: []
    };
  }

  searchNearby() {
    // current day and hour
    var date = new Date;
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var building = this.state.buildingQuery;

    var results = [];

    UTSTimetable.data.forEach((subject) => {
      subject.classes.forEach((subjClass) => {
        if(subjClass.day === day && subjClass.hour === hour && subjClass.building === building) {
          results.push(Object.assign({ subjectName: getSubjectNameForCode(subject.subjectCode), subjectCode: subject.subjectCode }, subjClass))
        }
      });
    })

    this.setState({
      searchNearbyResults: results
    })
  }

  searchSubjectsByText() {
    var fuzzy = require('fuzzy');
    var results = fuzzy.filter(this.state.searchByTextQuery, UTSSubjects, {
      extract: function(el) { return el.subjectName; }
    });

    // find a set of similar subjects
    // filter down if we don't have them in this autumn semester
    var subjects = results.map((item) => {
      var subjectCode = item.original.subjectCode;

      var subjectTimetable = UTSTimetable.data.find((timetableSubj) => {
        return timetableSubj.subjectCode === subjectCode;
      })


      if(subjectTimetable.classes.length < 1) return null;

      return Object.assign(item.original, subjectTimetable);
    })

    this.setState({ searchByTextResults: subjects.filter((el) => el).splice(0, 50) });
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
                <MenuItem value={null} primaryText={'None'}/>
              </DropDownMenu>

              <RaisedButton label="Search" primary={true} onClick={this.searchNearby}/>

              <ResultsSection unitOfMeasurement={"classes"} results={this.state.searchNearbyResults} renderItem={(item) => <ClassCard {...item}/>}/>

              </div>
            </Tab>


            <Tab label="Search" value={1}>
              <div>
                <TextField
                  hintText="Keywords, subject code, etc." onChange={(ev) => this.setState({ searchByTextQuery: ev.target.value })} value={this.state.searchByTextQuery}/>
                <RaisedButton label="Search" primary={true} onClick={this.searchSubjectsByText}/>


                <ResultsSection unitOfMeasurement={"subjects"} results={this.state.searchByTextResults} renderItem={(item) => <SubjectCard {...item}/>}/>

              </div>
            </Tab>
          </Tabs>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default Main;
