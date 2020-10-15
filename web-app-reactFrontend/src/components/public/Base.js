import React from 'react';
import {Route,Switch} from 'react-router-dom'
import Welcome from './Welcome'

function Base() {
  return (
    <div>
      <h2>Public Base Page</h2>
      {/* <Navbar /> */}
        <Switch>
            <Route path='/public/welcome' component={Welcome}/>
            <Route path='/public' component={Welcome}/>
        </Switch>
    </div>
  )
}

export default Base
