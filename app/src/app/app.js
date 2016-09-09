import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import { AppContainer, ShowSingleSubject, SearchSubjects, NearbyClasses } from './Main';
import initAnalytics from './analytics';



// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();





const NoMatch = () => <span>No match</span>;

initAnalytics();


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
    	<Route path="search-subjects(/:searchQuery)" component={SearchSubjects}>
	      <Route path="subjects/:id" component={ShowSingleSubject}/>
    	</Route>

    	<Route path="nearby(/:location)" component={NearbyClasses}/>

      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('app'))

// <IndexRoute component={MainView} />
