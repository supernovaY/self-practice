import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from './home/index';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path={['/']} component={Home} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
