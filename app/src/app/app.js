import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import { MainView, ShowSingleSubject } from './Main';
import AppContainer from './AppContainer';




// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


const NoMatch = () => <span>No match</span>;


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
	  <IndexRoute component={MainView} />
      <Route path="/subjects/:id" component={ShowSingleSubject}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('app')) 