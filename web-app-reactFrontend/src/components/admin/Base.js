import React,{useContext} from 'react';
import {Switch} from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Info from './Info'
import ROLES from '../../strings/roles'
import ImageUpload from './ImageUpload'
import AllUsers from './AllUsers'
import SignUp from './../login/SignUp'
import PrivateRoute from '../../lib/PrivateRoute'
import { Context } from "../../contexts/Global.Context";

export default () =>{
  const { state ,dispatch} = useContext(Context);
  const allowedRoles = [ROLES.ADMIN]
  const BasePath = '/admin'
  return (
    <div style={{height: "100%"}}>  
    <div className="bg-div" style={{"backgroundImage": `url(https://my-first-react-website-on-aws-s3.s3.ap-south-1.amazonaws.com${state.bgImage})`}} ></div>
      <Navbar />
      <Switch>
        <PrivateRoute path={BasePath+'/info'} allowedRoles={allowedRoles} component={Info}/>
        <PrivateRoute path={BasePath+'/imageUpload'} allowedRoles={allowedRoles} component={ImageUpload}/>
        <PrivateRoute path={BasePath+'/allUsers'} allowedRoles={allowedRoles} component={AllUsers} />
        <PrivateRoute path={BasePath+'/signup'} allowedRoles={allowedRoles} component={SignUp} />
        <PrivateRoute path={BasePath} allowedRoles={allowedRoles} component={Info} />
      </Switch>
    </div>
  )
}