import React,{useContext,useEffect} from 'react';
import { Helmet } from 'react-helmet'
import {BrowserRouter as Router, Route,Switch,Redirect} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login/Login'
import SignUp from './components/login/SignUp'
import Public from './components/public/Base'
import {Context} from './contexts/Global.Context';
import Shared from './components/shared/Base';
import Admin from './components/admin/Base'
import User from './components/user/Base'
import {  Image} from "react-bootstrap";
//testing
function App() {
    const {state,getSession} = useContext(Context);
    useEffect(() => {
      getSession()
      // .then(res => {
        
      //   console.log("Session success",res)
      // }).catch(err=> {
      //   console.log("Session Error",err)
      // });;
      //<Image src={require("./static/images/working.gif")} fluid /> 
    }, []);
    return (
        <div className="container" >
        <Helmet>
          <title>AWS Serverless demo</title>
        </Helmet>
        {
          state.user.isAuthenticated === null?
          (<div className="LoadingDiv"/>):
          (
            (state.user.isAuthenticated)?
            (
              (state.user.attributes.registrationComplete)?
              (
                <Router>
                    <Switch>
                    <Route path='/public' component={Public}/>
                    <Route path='/shared' component={Shared}/>
                    <Route path='/admin' component={Admin}/>
                    <Route path='/user' component={User}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/signup' component={SignUp}/>
                    <Route path='/' component={Login}/>
                    </Switch>
                </Router>
              )
              :
              (
                <Router>
                    <Switch>
                      <Route path='/' component={Shared}/>
                    </Switch>
                    <Redirect to="/shared/register" />
                </Router>
              )
            ):
            (
              <Router>
                  <Switch>
                    <Route path='/public' component={Public}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/signup' component={SignUp}/>
                    <Route path='/' component={Login}/>
                  </Switch>
              </Router>
            )
          )
        }
        </div>
    );
}

export default App;
