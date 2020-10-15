import React, { useContext, useEffect, useState } from "react";
import { Context ,REDUCERS} from "../../contexts/Global.Context";
import Navbar from "./Navbar";
import axios from "axios";
import RES from '../../strings/AWS-Resources'
// import jq from ''
import {   Button,  Form,  Col,  Row,  Image,} from "react-bootstrap";

export default () => {
  const { getSession} = useContext(Context);
  const { state,dispatch } = useContext(Context);
  const [validated, setValidated] = useState(false);

  const userReg = {
    fullName:state.user.attributes.fullName,
    gender:state.user.attributes.gender,
    mobile:state.user.attributes.mobile,
    addrPincode:state.user.attributes.addrPincode,
    addrCity:state.user.attributes.addrCity,
    addrState:state.user.attributes.addrState,
    addrCountry:state.user.attributes.addrCountry,
    registrationComplete:true
  };
  const [user, setUser] = useState(userReg);
  const setFullName = (fullName) => { setUser({ ...user, fullName }); };
  const setGender = (gender) => {    setUser({ ...user, gender });  };
  const setMobile = (mobile) => {    setUser({ ...user, mobile });  };
  const setState = (addrState) => {    setUser({ ...user, addrState });  };
  const setCountry = (addrCountry) => {    setUser({ ...user, addrCountry });  };
  const setCity = (addrCity) => {    setUser({ ...user, addrCity });  };
  const setPincode = (addrPincode) => {    setUser({ ...user, addrPincode });  };
  const setDpPath = (dpPath) => { dispatch({type: REDUCERS.SET_DP_URL, payload: dpPath+("?"+Date.now())});  };
  useEffect(() => {
  }, []);

  
  const handleSubmit = (event) => {
      event.preventDefault();
    console.log("submit click")
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else{
      SaveUserDetails(event)
    }
    setValidated(true);
  }
  const SaveUserDetails = ()=>{
  
    console.log("Saving")
    const accessToken = state.user.jwtToken
    axios('/register ',  {
      baseURL:RES.AWS_API_PRIVATE,
      method: 'post',
      headers:{
          Authorization: accessToken? 'Bearer '+accessToken : 'Bearer'
      },
      data: user
    })
    .then(response =>{
      alert("Saved")
      getSession();
      console.log("Signed url Reponse Data :\n",response.data)
    })
    .catch(error=>{
      console.log("Signed Url Error :\n",error) 
    })
  }

  const UploadDpFile = (files) => {
    const file = files[0];
    console.log("Selected File :\n",file)
    if(file.type.split('/')[0]!== "image"){
      console.log("Selected File not Image:\n")
      return;
    }
    const folder = '/images/userdp'
    const accessToken = state.user.jwtToken
    const fileParts = file.name.split('.')
    const fileExtn = fileParts[file.name.split('.').length-1]
    
      axios('/userDpUrl',  {
        baseURL:RES.AWS_API_PRIVATE,
        method: 'post',
        headers:{
            Authorization: accessToken? 'Bearer '+accessToken : 'Bearer'
        },
        data: {
          fileExtn: fileExtn,
          folder: folder,
          bucket: RES.WEBSITE_S3_BUCKET_NAME,
          region: RES.WEBSITE_S3_BUCKET_REGION
        }
      })
      .then(response =>{
        console.log("Signed url Reponse Data :\n",response.data)
          axios.put(response.data.uploadUrl, files[0])
          .then((res) => {
              setDpPath(response.data.publicUrl);
              console.log("File Upload Success :\n",res)
          })
          .catch(error=>{
              console.log("File Upload Error :\n",error)          
          })
      })
      .catch(error=>{
        console.log("Signed Url Error :\n",error) 
      })
  }
  const girlDp = require("../../static/images/girl-dp.jpg");
  const boyDp = require("../../static/images/boy-dp.png");
  return (
    <div>
      <Row>
        <Col md="4">
          <hr />
          <Form>
            <Form.Group>
              <label  style={{ width: "100%" }}   className="btn btn-lg btn-primary"   >
                <Image src={( state.user.attributes.dpPath)?state.user.attributes.dpPath:(user.gender === "male" ? boyDp : girlDp)} fluid />
                <Form.File id="exampleFormControlFile1" 
                 onChange={event=>UploadDpFile(event.target.files)}/>
                <span>Select Picture</span>
              </label>
            </Form.Group>
          </Form>
        </Col>
        <Col md="6">
          <Form validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                readOnly
                type="email"
                value={state.user.attributes.email}
              />
            </Form.Group>
            <Form.Group controlId="formLoginId">
              <Form.Label>Login Id</Form.Label>
              <Form.Control readOnly value={state.user.attributes.userName} />
            </Form.Group>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text"
                required
                pattern=".{3,}"
                value={user.fullName} 
                onChange={(event) => setFullName(event.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formMobile">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control 
                required
                pattern=".{10,}"
                placeholder="Mobile No." value={user.mobile} 
                onChange={(event) => setMobile(event.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                required
                as="select"
                defaultValue={user.gender ? user.gender : "Choose..."}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="">--Select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAddrCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control value={user.addrCountry}
                required
                onChange={(event) => setCountry(event.target.value)} />
            </Form.Group>
            <Form.Group controlId="formAddrState">
              <Form.Label>State</Form.Label>
              <Form.Control value={user.addrState} 
                required
                onChange={(event) => setState(event.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formAddrCity">
              <Form.Label>City</Form.Label>
              <Form.Control value={user.addrCity}
                required
                onChange={(event) => setCity(event.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formAddrPincode">
              <Form.Label>Pin Code</Form.Label>
              <Form.Control value={user.addrPincode} 
                required
                pattern=".{6,}"
                onChange={(event) => setPincode(event.target.value)}/>
            </Form.Group>
            <hr />
            <Button md="8" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      <br />
    </div>
  );
};
