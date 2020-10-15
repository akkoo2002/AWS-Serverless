import React,{useEffect,useState} from 'react'
import axios from 'axios'
import URLS from '../../strings/AWS-Resources'

function Base() {

  const[apiResult, setApiResult] = useState("Loading..")
  useEffect(()=>{
    var body = {
    }
    axios({
      baseURL:URLS.AWS_API_PUBLIC,
      method: 'post',
      url: '/publicbase',
      data: body
    })
    .then(response =>{
      console.log(response)
      setApiResult(JSON.stringify(response.data))
    })
    .catch(error=>{
      console.log("Admin Info Error:\n",error);
      setApiResult('Error'+error)
    })
},[])
  return (
    <div>
      <h2>Welcome Page</h2>
      <h3>{apiResult}</h3>
    </div>
  )
}

export default Base
