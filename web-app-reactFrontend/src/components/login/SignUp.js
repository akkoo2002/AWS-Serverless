import React, { useState, useContext } from "react";
import { Context } from "../../contexts/Global.Context";
import ROLES from "../../strings/roles";
import AWSRES from "../../strings/AWS-Resources";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import {  useHistory } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  Col,
  InputGroup,
  Alert,
  Modal
} from "react-bootstrap";
const { v4: uuidv4 } = require("uuid");

const UserPool = new CognitoUserPool({
  UserPoolId: AWSRES.COGNITO_USERPOOL_ID,
  ClientId: AWSRES.COGNITO_CLIENT_ID,
});

export default () => {
  const history = useHistory();
  const {state } = useContext(Context);
  const [showError, setShowError] = useState();
  const [showDialog, setShowDialog] = React.useState(false);

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [validated, setValidated] = useState(false);
  const [working, setWorking] = useState(false);

  const role = state.user.role?state.user.role:ROLES.USER
  const onSubmit = (event) => {
    event.preventDefault();
    var token = {
      Name: "token",
    };
    if (role === ROLES.ADMIN) {
      if (state.user.jwtToken) {
        token.Value = state.user.jwtToken;
      } else {
        console.log("not logged in to create admin");
      }
    }
    else if (role === ROLES.USER) {
      token = null;
    } 
    else {
      console.log("not valid role");
      return;
    }
    setShowError("Working..");
    setWorking(true)
    const uid=uuidv4()
    const userAttr = [
      
      { Name: "email", Value: email },
      { Name: "gender", Value: gender },
      { Name: "name", Value: fullName },
      { Name: "custom:role", Value: role },
      { Name: "profile", Value: uid },
    ]
    console.log(userAttr)
    UserPool.signUp(
      userName,
      password,
      userAttr,
      [token],
      (err, data) => {
        if (err) {
          let disperr = "Error Registering";
          if (err.message.trim().split("\n").length > 1) {
            disperr = err.message.split("\n")[1];
          }

          setShowError("Sign-Up Failed - "+disperr);
          setTimeout(() => {
            setShowError(null);
          }, 2000);
          console.log("error: ", err.message);
        } else {    
          setShowDialog(true)
          console.log("Data: ", data);
        }
        setWorking(false)
      }
    );
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else{

      if(password!==confirmPassword){
        setShowError("Confirm Password Not Matched !!")
        return
      }
  
      //onSubmit(event)
    }
    setValidated(true);
  };
  function SignUpDialog(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Rigistration Successfull</h4>
          <p>
            You are registered successfully in system.
            we have sent you an mail , please click on link to verify your email.
            and visit to <a href="/login" >Login</a> to complete registration.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  function AlertDismissible() {

    if (showError) {
      return (
        <Alert
          style={{
            position:"absolute",
            bottom: "0px",
            right: "20%",
            left: "20%",
          }}
          variant={showError==='Working..'?"info":"danger"}
          onClose={() => setShowError(null)}
          dismissible
        >
          <p>{showError}</p>
        </Alert>
      );
    }
    return <></>;
  }
  const bgImage = require('../../static/images/reg.jpg');
  return (
      <div >
        <br />
      <div className="bg-div" style={{"backgroundImage": `url(${bgImage})`}} ></div>
      <Card>
        <Card.Header><h2>New Registration</h2></Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="validationCustomUsername">
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      aria-describedby="inputGroupPrepend"
                      required
                      onChange={event=>setEmail(event.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter Email.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="validationCustom03">
                  <Form.Label>Login ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User Name"
                    value={userName}
                    required
                    pattern=".{3,}"
                    onChange={event=>setUserName(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select Login ID
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Password"
                    value={password}
                    required
                    type="password"
                    pattern=".{8,}"
                    onChange={event=>setPassword(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter password
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    required
                    type="password"
                    pattern=".{8,}"
                    onChange={event=>setConfirmPassword(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Confirm Password
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <hr />
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    required
                    onChange={event=>setFullName(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your name
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="exampleForm.SelectCustom">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control 
                    as="select" 
                    required 
                    defaultValue="hi" 
                    onChange={event=>setGender(event.target.value)}
                  >
                    <option value="">--Select--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <hr />
              <Form.Row className="row justify-content-end">
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Button disabled={working} style={{ width: "100%" }} type="submit">
                    Sign-Up
                  </Button>
                </Form.Group>
              </Form.Row>
            </Form>
        </Card.Body>
      </Card>
      <SignUpDialog
        show={showDialog}
        onHide={() => {
          setShowDialog(false)
          history.replace("/login")
        }}
      />
      <AlertDismissible />
      </div>
  );
};

// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Sid": "PublicReadGetObject",
//             "Effect": "Allow",
//             "Principal": "*",
//             "Action": "s3:GetObject",
//             "Resource": "arn:aws:s3:::my-first-react-website-on-aws-s3/*"
//         },
//         {
//             "Sid": "3",
//             "Effect": "Allow",
//             "Principal": {
//                 "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E3K740O4Q4GUW9"
//             },
//             "Action": "s3:GetObject",
//             "Resource": "arn:aws:s3:::my-first-react-website-on-aws-s3/*"
//         }
//     ]
// }
