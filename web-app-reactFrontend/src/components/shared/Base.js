import React,{useContext} from 'react';
import {Switch} from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Register from './Register'
import ChangePassword from './ChangePassword'
import ROLES from '../../strings/roles'
import PrivateRoute from '../../lib/PrivateRoute'
import { Context } from "../../contexts/Global.Context";

export default () =>{
  const { state ,dispatch} = useContext(Context);
  const allowedRoles = [ROLES.ADMIN,ROLES.USER]
  const BasePath = '/shared'
  return (
    <div style={{height: "100%"}}>  
    <div className="bg-div" style={{"backgroundImage": `url(https://my-first-react-website-on-aws-s3.s3.ap-south-1.amazonaws.com${state.bgImage})`}} ></div>
      <Navbar />
      <Switch>
        <PrivateRoute path={BasePath+'/register'} allowedRoles={allowedRoles} component={Register}/>
        <PrivateRoute path={BasePath+'/changePassword'} allowedRoles={allowedRoles} component={ChangePassword}/>
        <PrivateRoute path={BasePath} allowedRoles={allowedRoles} component={Register} />
      </Switch>
    </div>
  )
}