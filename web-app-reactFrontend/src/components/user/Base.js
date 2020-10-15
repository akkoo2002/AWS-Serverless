import React from 'react';
import {Switch} from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Info from './Info'
import ROLES from '../../strings/roles'
import PrivateRoute from '../../lib/PrivateRoute'

function Base() {
  const allowedRoles = [ROLES.USER]
  const BasePath = '/user'
  return (
    <div>
        <Navbar />
        <Switch>
            <PrivateRoute path={BasePath+'/info'} allowedRoles={allowedRoles} component={Info}/>
            <PrivateRoute path={BasePath} allowedRoles={allowedRoles} component={Info}/>
        </Switch>
    </div>
  )
}

export default Base
