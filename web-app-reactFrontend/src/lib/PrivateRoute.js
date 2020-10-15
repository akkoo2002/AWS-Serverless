import React, { useContext,useEffect} from 'react';
import {Redirect, Route } from 'react-router-dom'
import {Context} from '../contexts/Global.Context';

export default ({ component: Component, ...rest })=> {
    const {state} = useContext(Context);    
    
    const getAllowed = (allowedRoles)=>{
        if(!state.user.isAuthenticated)return false
        if(state.user.isSuperAdmin)return true
        if(!allowedRoles)return true
        if(!allowedRoles.includes(state.user.role))return false
        return true;
    }
    
    return (
      <Route {...rest} 
        render={props =>            
            getAllowed(rest.allowedRoles)?
            (<Component {...props } {...rest}/>): 
            (<Redirect  to={{ pathname: "/login",state: { from: props.location, role: rest.allowedRoles} }} />)
        }
      />
    );
  }