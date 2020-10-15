import React,{useContext,useEffect,useState} from 'react'
import {Context} from '../../contexts/Global.Context';
import axios from 'axios'
import URLS from '../../strings/AWS-Resources'

function UserInfo() {
    const[apiResult, setApiResult] = useState("Loading..")
    const {state} = useContext(Context);


    const callawslambda = (val)=>{
      const accessToken = state.user.jwtToken
      var body = {
      }
      axios(val,  {
        baseURL:URLS.AWS_API_PRIVATE,
        method: 'post',
        headers:{
          Authorization: accessToken? 'Bearer '+accessToken : 'Bearer' 
        },
        data: body
      })
      .then(response =>{
        console.log("Response:\n",(response.data));
        setApiResult(response.data)
      })
      .catch(error=>{
        console.log("Admin Info Error:\n",error);
        setApiResult('Error'+error)
      })
    }
    useEffect(()=>{
      callawslambda('');
    },[])
    return (
        <div>
            welcome, {state.user.attributes.email}
       
            <h3>{apiResult}</h3>
        </div>
    )
}

export default UserInfo
