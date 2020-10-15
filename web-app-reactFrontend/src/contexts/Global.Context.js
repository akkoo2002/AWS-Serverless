import React, { createContext, useReducer } from "react";
import AWSRES from "../strings/AWS-Resources";
import axios from "axios";
import URLS from "../strings/AWS-Resources";
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const UserPool = new CognitoUserPool({
  UserPoolId: AWSRES.COGNITO_USERPOOL_ID,
  ClientId:AWSRES.COGNITO_CLIENT_ID
});
const REDUCERS_TYPES = {
  SET_USER:"SET_USER",
  CLEAR_USER:"CLEAR_USER",
  SET_DP_URL:"SET_DP_URL",
  SET_BG_IMAGE:"SET_BG_IMAGE",
}
const Reducer = (state, action) => {
  switch (action.type) {
    case REDUCERS.SET_USER:
      
      console.log("user details success:\n",action.payload);
      return {
        ...state,
        user:{
          ...state.user,
          role : action.payload.attributes["custom:role"],
          isSuperAdmin:false,
          isAuthenticated: true,
          registrationComplete:action.payload.attributes.registration_completed,
          jwtToken : action.payload.session.idToken.jwtToken,
          attributes:{
              ...action.payload.userDetails,
              email:action.payload.attributes.email,
              dpPath:action.payload.userDetails.dpPath
          },
        },
          bgImage:"/images/system/"+action.payload.attributes["custom:role"]+"_bgImage.jpg"+("?"+Date.now()),
      };
    case REDUCERS.CLEAR_USER:
      
      console.log("Clearing User:\n");
      return {
        user : {
          role:null,
          isSuperAdmin:false,
          isAuthenticated: false,
          jwtToken:null,
          attributes:{
            registrationComplete:false,
          }
        },
        error: null,
      };
    case REDUCERS.SET_DP_URL:
      return {
        ...state,
        user:{
          ...state.user,
          attributes:{
            ...state.user.attributes,
            dpPath:action.payload
          }
        },
      };
      
    case REDUCERS.SET_BG_IMAGE:
      return {
        ...state,
        user:{
          ...state.user,
          attributes:{
            ...state.user.attributes,
          }
        },
        bgImage :"/images/system/"+state.user.role+"_bgImage.jpg"+("?"+Date.now()),
      };
    default:
      return state;
  }
};

const initialState = {
  user : {
    isAuthenticated: null,
    role:null,
    isSuperAdmin:false,
    jwtToken:null,
    attributes:{
      registrationComplete:false
    }
  },
  error: null,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);


  const getUser = (sessionData)=>{
    const accessToken = sessionData.session.idToken.jwtToken
    axios("userDetails",  {
      baseURL:URLS.AWS_API_PRIVATE,
      headers:{
        Authorization: accessToken? 'Bearer '+accessToken : 'Bearer' 
      },
    })
    .then(response =>{
      sessionData.userDetails = response.data
      dispatch({type: REDUCERS.SET_USER, payload: sessionData});
    })
    .catch(error=>{
      console.log("user Details Error:\n",error);
      logout();
    })
  }

  const getSession = async () =>
    await new Promise((res, rej) => {
      const reject=(err)=>{
        logout();
      }
      const resolve=(sessionData)=>{
        getUser(sessionData);
      }
      var user = UserPool.getCurrentUser();
      if (user) {
        try{
        user.getSession(async (err, session) => {
          if (err) {
            reject(err);
          } 
          else 
          {
            const attributes = await new Promise((resolve, reject) => {
              user.getUserAttributes((err, attiributes) => {
                if (err) {
                  reject(err);
                } else {
                  const result = {};
                  for (let attribute of attiributes) {
                    const { Name, Value } = attribute;
                    result[Name] = Value;
                  }
                  resolve(result);
                }
              });
            })
            resolve({
              user,
              session,
              attributes,
            });
          }
        })
        }
        catch(error){
          reject(error)
        }
      } 
      else {
        reject("no user");
      }
    })

  const authenticate = async (Username, Password,Role,RemeberMe) =>
    await new Promise((resolve, reject) => {
      var user= new CognitoUser({ Username, Pool:UserPool });
      const ValidationData = {
        role:Role,
        account:'open'
      }
      const authDetails = new AuthenticationDetails({ email:Username, Password,ValidationData });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("Auth Success:", data);
          resolve(data);
        },

        onFailure: (err) => {
          console.error("Auth Failure:", err);
          reject(err);
        },

        newPasswordRequired: (data) => {
          console.log("Auth newPasswordRequired:", data);
          resolve("data");
        },
      });
    });
  const logout = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
      dispatch({ type: REDUCERS.CLEAR_USER, payload: null });
  };
  const changePassword = (password,newPassword,callBack) => {
    var user = UserPool.getCurrentUser();
    if (user) {
      user.getSession(async (err, session) => {
        if (err)  callBack("session err",null)
        else user.changePassword(password,newPassword,callBack)
      });
    } 
    else {
      callBack("Not Logged In",null)
    }
  };
  const globalSignOut = (callBack) => {
    var user = UserPool.getCurrentUser();
    if (user) {
      user.getSession(async (err, session) => {
        if (err)  callBack("session err",null)
        else user.getDevice({
          onSuccess: (data) => {
            callBack(null,data)
          },
          onFailure: (err) => {
            callBack(err,null)
          },
        })
      });
    } 
    else {
      callBack("Not Logged In",null)
    }
  };
  return (
    <Context.Provider
      value={{ state, dispatch, logout, authenticate, getSession,getUser,changePassword ,globalSignOut}}
    >
      {children}
    </Context.Provider>
  );
};

export const REDUCERS =REDUCERS_TYPES;
export const Context = createContext(initialState);
export default Store;
