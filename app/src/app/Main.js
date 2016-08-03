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

import TimePicker from 'material-ui/TimePicker';

import SelectField from 'material-ui/SelectField';

import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardText
} from 'material-ui/Card';

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator
} from 'material-ui/Toolbar';

import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline';
import IconButton from 'material-ui/IconButton';

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

// TODO I fucked up date parsing
// Mine is zero-based, JS is one-based
function convertFromMyBuggyDayToJSDay(day) {
  return (day + 1);
}
function convertFromJSDayToMyBuggyDay(day) {
  return (day - 1);
}
function convertFromMyBuggyHourToJSHour(hour) {
  return hour; // TODO FIX LATER
  // return hour - 1; 
  // mine is one-based, JS is zero-based
  // how did I do this twice??
}

class ClassCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var classType = ClassTypes[this.props.classType.toUpperCase()];

    const theHour = moment({
      hours: this.props.hour,
      minutes: this.props.min
    }).format('h.mma');
    

    return (
    <Card>
      <CardHeader
        title={this.props.subjectName}
        subtitle={`${theHour} - ${classType}`}
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
    });

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
          {this.props.classes.map((subjectClass, i) => {

            var dateNice = moment({
              hours: convertFromMyBuggyHourToJSHour(subjectClass.hour),
              minutes: subjectClass.min
            }).isoWeekday(convertFromMyBuggyDayToJSDay(subjectClass.day)).format('dddd h.mma');

            var classType = ClassTypes[subjectClass.classType.toUpperCase()];

            return <ListItem key={i}
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

class ResultsSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var note = this.props.results.length > 0 ? this.props.results.length + ' ' + this.props.unitOfMeasurement + ' found!' : 'no results :-(';
    return (
      <div>
        <h2 style={{paddingLeft:15,paddingTop:10}}>{note}</h2>

        <div>
          {this.props.results.map(this.props.renderItem)}
        </div>
      </div>
    );
  }
}

const UTSBuildings = `
CB11: FEIT
CB10: Building 10

CB07: B7 Health/Science
CB04: B4 Science
CB01: Tower
CB02: Building 2

CB03: B3 Arts

CB06: B6 DAB

CB05: B5 Haymarket

CB08: Brown paper bag
`.split('\n').filter((item) => item).map((item) => {
  const [code, text] = item.split(': ');
  return { code, text };
});
// console.log(UTSBuildings)


// All for that sweet UX
function roundTimeQuarterHour() {
    var time = new Date;

    time.setMilliseconds(Math.round(time.getMilliseconds() / 1000) * 1000);
    time.setSeconds(Math.round(time.getSeconds() / 60) * 60);
    time.setMinutes(Math.round(time.getMinutes() / 15) * 15);
    return time;
}

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.searchNearby = this.searchNearby.bind(this);
    this.searchSubjectsByText = this.searchSubjectsByText.bind(this);


    this.state = {
      aboutDialogOpen: false,


      searchNearbyResults: [],
      buildingQuery: UTSBuildings[0].code,
      currentTime: roundTimeQuarterHour(),

      searchByTextQuery: '',
      searchByTextResults: []
    };
  }

  updateCurrentTimeQuery(date) {
    this.setState({ currentTime: date });
  }




  searchNearby() {
    // current day and hour
    var date = new Date;
    var day = convertFromJSDayToMyBuggyDay(date.getDay());
    var hour = this.state.currentTime.getHours();
    var minutes = this.state.currentTime.getMinutes();
    var building = this.state.buildingQuery;

    var results = [];

    UTSTimetable.forEach((subject) => {
      subject.classes.forEach((subjClass) => {
        if(subjClass.day === day && (subjClass.hour === hour || (subjClass.hour-1) === hour) && subjClass.building.startsWith(building)) {
          results.push(Object.assign({ 
            subjectName: getSubjectNameForCode(subject.subjectCode),
            subjectCode: subject.subjectCode 
          }, subjClass))
        }
      });
    });

    results.sort((a, b) => {
      return a.hour - b.hour;
    });

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

      var subjectTimetable = UTSTimetable.find((timetableSubj) => {
        return timetableSubj.subjectCode === subjectCode;
      })


      if(subjectTimetable.classes.length < 1) return null;

      return Object.assign(item.original, subjectTimetable);
    })

    this.setState({ searchByTextResults: subjects.filter((el) => el).splice(0, 50) });
  }





  
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        <div style={styles.container}>
          <Dialog title="About" modal={false} open={this.state.aboutDialogOpen} onRequestClose={() => this.setState({ aboutDialogOpen: false })}>
            <p>Don't be a drop out! Come drop in! Any class at UTS, at your fingertips -- university as a place of open learning!</p>
            <p>Built by <a href="http://liamz.co">Liam Zebedee</a>. Not built/sponsored/fed by UTS.</p>
          </Dialog>

          <AppBar
          title="Drop In @ UTS"
          iconElementLeft={<IconButton onClick={() => this.setState({ aboutDialogOpen: true })}><ActionInfoOutline/></IconButton>}
          />

          <Tabs>
            <Tab label="Nearby" value={0}>
              <div>
                <Toolbar>
                  <ToolbarGroup firstChild={true} float="left">
                    <DropDownMenu value={this.state.buildingQuery} onChange={(event, index, value) => this.setState({ buildingQuery: value })}>
                      {UTSBuildings.map((item, i) => <MenuItem key={i} value={item.code} primaryText={item.text}/>)}
                    </DropDownMenu>

                    <TimePicker
                      value={this.state.currentTime}
                      onChange={(ev, date) => this.updateCurrentTimeQuery(date)}
                      autoOk={true} textFieldStyle={{ width: 90 }} />

                    <ToolbarSeparator/>

                    <RaisedButton label="Search" primary={true} onClick={this.searchNearby}/>
                  </ToolbarGroup>
                </Toolbar>

                <ResultsSection unitOfMeasurement={"classes"} results={this.state.searchNearbyResults} renderItem={(item, i) => <ClassCard key={i} {...item}/>} />
              </div>
            </Tab>


            <Tab label="Search" value={1}>
              <div>
                <Toolbar>
                  <ToolbarGroup firstChild={true} float="left">
                    <TextField
                      style={{ marginTop: '4px', paddingLeft: '12px' }}
                      hintText="Keywords, subject code, etc." onChange={(ev) => this.setState({ searchByTextQuery: ev.target.value })} value={this.state.searchByTextQuery} key={'searchByTextQuery'}/>

                    <RaisedButton style={{ margin: '10px 8px' }} label="Search" primary={true} onClick={this.searchSubjectsByText}/>
                  </ToolbarGroup>
                </Toolbar>

                <ResultsSection unitOfMeasurement={"subjects"} results={this.state.searchByTextResults} renderItem={(item, i) => <SubjectCard key={i} {...item}/>}/>

              </div>
            </Tab>
          </Tabs>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default Main;
