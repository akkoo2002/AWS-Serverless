import React,{useContext,useEffect,useState} from 'react'
import {Context} from '../../contexts/Global.Context';
import axios from 'axios'
import URLS from '../../strings/AWS-Resources'
import {Table,Image, Button} from 'react-bootstrap'
import {useLocation } from "react-router-dom";

function AdminInfo(props) {
  
  const[currRole, setCurrRole] = useState()
  const[allUsers, setAllUsers] = useState([])
  const[callState, setCallState] = useState("loading")
    const {state} = useContext(Context);

    const callawslambda = (val,showRole)=>{
      setCurrRole(showRole)
      setCallState("loading")
      const accessToken = state.user.jwtToken
      var body = {
        role: showRole,
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
        const asd = response.data
        console.log("Response:\n",(asd));
        setAllUsers(asd)
        console.log("UserList:\n",allUsers);
        setCallState("ready")
      })
      .catch(error=>{
        console.log("Admin Info Error:\n",error);
        setCallState('failed')
      })
    }


    useEffect(()=>{
      callawslambda('/allUsers','admin');
    },[])
    return (
        <div>
          < br />
          <div style={{display:"flex","justify-content":"space-around"}}>
            <Button disabled={currRole==='admin'} style={{width:"40%"}}  onClick={()=>{callawslambda('/allUsers','admin')}}>Admin</Button>
            <Button  disabled={currRole==='user'}  style={{width:"40%"}}  onClick={()=>{callawslambda('/allUsers','user')}}>Users</Button>
            </div>
            <br />
            {
              (callState==="loading")?
              (
                <div className="LoadingDiv"/>
              ):
              (
                (callState==="failed")?
                (
                  <div><h3>Error While Reading Data...</h3></div>
                )
                :
                (
                  <Table style={{opacity: "0.7"}}  striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>DP</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Pincode</th>
                        <th>Verified</th>
                        <th>Complete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        allUsers.map((recUser,i) =>(
                          <tr key={i}>
                              <td>
                                <Image 
                                  style={{width:"50px",height:"50px" ,"marginRight":"10px"}} 
                                  src={recUser.dpPath} rounded 
                                />
                              </td>
                              <td>{recUser.fullName}</td>
                              <td>{recUser.email}</td>
                              <td>{recUser.gender}</td>
                              <td>{recUser.addrCity}</td>
                              <td>{recUser.addrState}</td>
                              <td>{recUser.addrPincode}</td>
                              <td>{recUser.email_verified?"Yes":"No"}</td>
                              <td>{recUser.registrationComplete?"Yes":"No"}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                )
              )
            }
        </div>
    )
}

export default AdminInfo





