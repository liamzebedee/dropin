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
import Avatar from 'material-ui/Avatar';
import SelectField from 'material-ui/SelectField';
import {
  Card,
  CardHeader,
  CardMedia,
  CardText,
  CardActions,
} from 'material-ui/Card';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from 'material-ui/Toolbar';
import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import { Router, Route, Link, browserHistory } from 'react-router';

import Chip from 'material-ui/Chip';
import {blue300, indigo900} from 'material-ui/styles/colors';

// import clipboard from 'clipboard';
import _ from 'underscore'

import API from './API';

var moment = require('moment');
moment.locale('en-AU');

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
  "WRK": "Workshop",
};

const styles = {
  container: {
  },
  classLocation: {
  },
  classLocationBit: {
    paddingRight: 5,
    fontWeight: 600,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});


class ResultsSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log(this.props.results);
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

function getNiceUTSBuildingName(buildingCode) {
  return _.findWhere(UTSBuildings, { code: buildingCode }).text;
}

// All for that sweet UX
function roundTimeQuarterHour(time) {
    time = time || new Date;

    time.setMilliseconds(Math.round(time.getMilliseconds() / 1000) * 1000);
    time.setSeconds(Math.round(time.getSeconds() / 60) * 60);
    time.setMinutes(Math.round(time.getMinutes() / 15) * 15);
    return time;
}


// -------------------
// Search for subjects
// -------------------

export class SearchSubjects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchByTextQuery: this.props.location.query['searchQuery'] || '',
      searchByTextResults: [],
    }

    this.searchSubjectsByText = this.searchSubjectsByText.bind(this)
  }

  componentDidMount() {
    if(this.state.searchByTextQuery !== '') this.searchSubjectsByText();
  }

  searchSubjectsByText() {
    let results = API.searchSubjectsByText(this.state.searchByTextQuery).then((results) => {
      this.setState({ searchByTextResults: results });
    });
  }

  render() {
    let result;
    if(!this.props.children)
      result = <ResultsSection unitOfMeasurement={"subjects"} results={this.state.searchByTextResults} renderItem={(item, i) => <SubjectCard key={i} {...item}/>}/>;
    else
      result = this.props.children;

        return <div>
                <Toolbar>
                  <ToolbarGroup firstChild={true}>
                    <FontIcon className="material-icons">search</FontIcon>
                    <TextField
                      hintText="Keywords, code, etc." onChange={(ev) => this.setState({ searchByTextQuery: ev.target.value })} value={this.state.searchByTextQuery} name='searchByTextQuery' style={{
                          width: 200,
                          display: 'inline',
                        }}/>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <RaisedButton label="Search" primary={true} onClick={this.searchSubjectsByText}/>
                    </ToolbarGroup>
                </Toolbar>

                {result}
              </div>;
  }
}

class SubjectCard extends React.Component {
  render() {
    if(!this.props.sessions[0]) return null;

    this.props.sessions[0].classes.sort((a, b) => {
      return (a.day - b.day);
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
          {this.props.sessions[0].classes.map((subjectClass, i) => {

            var dateNice = moment({
              hours: subjectClass.startHour,
              minutes: subjectClass.startMin,
            }).day(1  + subjectClass.day).format('dddd h.mma');

            var classType = ClassTypes[subjectClass.classType.toUpperCase()];
            let hours = Math.round(subjectClass.durationInMins / 60, 1);

            return <ListItem key={i}
              primaryText={dateNice}
              secondaryText={`${classType} in ${subjectClass.location} - ${hours}hrs`}
            />;
          })}
        </List>
      </CardText>
    </Card>
    );
  }
}

// ---------------
// Nearby subjects
// ---------------

export class NearbyClasses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchNearbyResults: [],
      buildingQuery: UTSBuildings[0].code,
      currentTime: roundTimeQuarterHour(),
    }

    this.changeBuildingQuery = this.changeBuildingQuery.bind(this)
    this.changeCurrentTime = this.changeCurrentTime.bind(this)
    this.searchNearby = this.searchNearby.bind(this)
  }

  componentDidMount() {
    this.searchNearby(this.state.buildingQuery, this.state.currentTime);
  }

  changeBuildingQuery(event, index, value) {
     this.setState({ buildingQuery: value })
     this.searchNearby(value, this.state.currentTime);
  }

  changeCurrentTime(ev, date) {
    date = roundTimeQuarterHour(date)
    this.setState({ currentTime: date });
    this.searchNearby(this.state.buildingQuery, date);
  }

  searchNearby(building, time) {
    let results = API.searchNearbyClasses(building, time)
    .then((results) => {
      this.setState({ searchNearbyResults: results })
    });
  }

  render() {
    return <div>
                <Toolbar noGutter={true}>

                  <ToolbarGroup firstChild={false}>

                    <FontIcon className="material-icons">place</FontIcon>
                    <DropDownMenu value={this.state.buildingQuery} onChange={this.changeBuildingQuery} fullWidth={true} >
                      {UTSBuildings.map((item, i) => <MenuItem key={i} value={item.code} primaryText={item.text}/>)}
                    </DropDownMenu>
                  </ToolbarGroup>

                  <ToolbarGroup lastChild={true}>
                      <FontIcon className="material-icons">alarm</FontIcon>
                      <TimePicker
                        name='time'
                        value={this.state.currentTime}
                        onChange={this.changeCurrentTime}
                        autoOk={true}
                        textFieldStyle={{
                          width: 90,
                          display: 'inline',
                        }}/>
                  </ToolbarGroup>
                </Toolbar>
                <ResultsSection unitOfMeasurement={"classes"} results={this.state.searchNearbyResults} renderItem={(item, i) => <ClassCard key={i} {...item}/>} />
              </div>;
  }
}

class SubjectInfoCard extends React.Component {
  render() {
    console.log('Rendering...',this.props);
    return (
    <Card>
      <CardHeader
        title={this.props.name}
        subtitle={this.props.code}
      />
      <CardText>
        {this.props.description || 'Just another useless subject offered by UTS'}
      </CardText>
    </Card>
    );
  }
}

class ClassCard extends React.Component {
  constructor(props) {
    super(props);
    this.navToClass = this.navToClass.bind(this)
    this.navToSubject = this.navToSubject.bind(this)
  }

  navToClass() {
    browserHistory.push(`/search-subjects/subjects/${this.props.subjectId}`);
  }

  navToSubject() {
    browserHistory.push(`/subjects/${this.props.subjectId}`);
  }

  render() {
    var classType = ClassTypes[this.props.classType.toUpperCase()];

    const theHour = moment({
      hours: this.props.startHour,
      minutes: this.props.startMin,
    }).format('h.mma');

    // let nicerBuildingName = getNiceUTSBuildingName(this.props.building);
    let nicerBuildingName = this.props.building;

    return (
    <Card>

      <CardHeader
        title={this.props.subject.name}
        subtitle={`${theHour} - ${classType}`}
        actAsExpander={true}
        showExpandableButton={true}
      />


      <CardText expandable={true}>
        <Chip style={{ margin: 4 }}>
          <Avatar icon={<FontIcon className="material-icons">alarm</FontIcon>} />
          {this.props.durationInMins} mins
        </Chip>

        <Chip
          style={{ margin: 4 }}>
          <Avatar icon={<FontIcon className="material-icons">info outline</FontIcon>} />

          {classType}
        </Chip>

        <Chip
          backgroundColor={blue300}
          style={{ margin: 4 }}
        >
          <Avatar icon={<FontIcon className="material-icons">place</FontIcon>} />
          {nicerBuildingName}.{this.props.level}.{this.props.room}
        </Chip>
      </CardText>


      <CardActions expandable={true}>
        <RaisedButton
          label="Share"
          primary={true}
          style={{margin: 12}}
          icon={<FontIcon className="material-icons">share</FontIcon>}
          onClick={this.navToClass}
        />
        <RaisedButton
          label="View subject"
          primary={true}
          style={{margin: 12}}
          icon={<FontIcon className="material-icons">share</FontIcon>}
          onClick={this.navToSubject}
        />
      </CardActions>
    </Card>
    );
  }
}

// -------------------
// Show single subject
// -------------------

export class ShowSingleSubject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    let info = API.getSubjectInfo(this.props.params.id).then((info) => {
      //console.log('Called',info);
      this.setState({ subject: info });
    });
  }
  render() {
    if(!this.state.subject) {
      return <div>Loading...</div>;
    }
    return <div>
      <SubjectInfoCard {...this.state.subject}/>
    </div>;
  }
}





// let $clipboard = new Clipboard('.btn');

// $clipboard.on('success', function(e) {
//   alert(e.text);

// // console.info('Action:', e.action);
// // console.info('Text:', e.text);
// // console.info('Trigger:', e.trigger);

//   e.clearSelection();
// });



// <Link to="/subjects/123">Sample subject link</Link>

let AboutDialogContent = (props) =>
  <div>
    <p>Don't be a drop out! Come drop in! Any class at UTS, at your fingertips -- university as a place of open learning!</p>

    <p>Like us on <a href="https://www.facebook.com/dropinuts" target="_blank">Facey</a></p>

    <p>Built by UTS students, for UTS students</p>

    <a href="https://goo.gl/forms/zKenkNGlyTMm4raQ2" target="_blank">Feedback, ideas and suggestions</a>

    <h3>Shout outs</h3>
    <p>Built by <a href="http://liamz.co" target="_blank">Liam Zebedee</a> and
     <a href="https://github.com/jayesh100/" target="_blank">Jayesh Malhotra</a>.</p>
  </div>;


export class AppContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleUserSwapTab = this.handleUserSwapTab.bind(this)
    this.state = {
      aboutDialogOpen: false,
      currentTab: 'search',
    };
  }

  componentDidMount() {
    this.updateTabForRoute(this.props.location.pathname)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.location.pathname !== nextProps.location.pathname)
      this.updateTabForRoute(nextProps.location.pathname)
  }

  updateTabForRoute(route) {
    if(route.startsWith('/search-subjects'))
      this.setState({ currentTab: 'search-subjects' })
    else if(route.startsWith('/nearby'))
      this.setState({ currentTab: 'nearby' })
  }

  handleUserSwapTab(newTabName) {
    // TODO BUG WITH FUCKING onChange in Material-UI (React) http://www.material-ui.com/#/components/Tabs
    // It apparently forwards all the onChange events for all the child components here.
    if(typeof(newTabName) !== 'string') return;
    browserHistory.push(`/${newTabName}`);
  }


  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        <div style={styles.container}>
          <Dialog title="About" modal={false} open={this.state.aboutDialogOpen} onRequestClose={() => this.setState({ aboutDialogOpen: false })}>
            <AboutDialogContent/>
          </Dialog>

          <AppBar
          title="Drop In UTS"
          iconElementLeft={<IconButton onClick={() => this.setState({ aboutDialogOpen: true })}><ActionInfoOutline/></IconButton>}/>

          <Tabs value={this.state.currentTab} onChange={this.handleUserSwapTab}>
            <Tab label="Nearby" value={'nearby'}>
              {this.props.children}
            </Tab>

            <Tab label="Search" value={'search-subjects'}>
              {this.props.children}
            </Tab>
          </Tabs>
        </div>

      </MuiThemeProvider>
    );
  }
}
