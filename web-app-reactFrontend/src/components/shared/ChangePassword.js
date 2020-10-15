import React, { useState, useContext } from 'react'
import { Context ,REDUCERS} from "../../contexts/Global.Context";
import Navbar from "./Navbar";
import axios from "axios";
import RES from '../../strings/AWS-Resources'
import {  Toast, Card,  Container,  Button,  Form,  Col,  InputGroup,  Row,Image} from "react-bootstrap";

function ChangePassword() {
    const {state,authenticate,changePassword,globalSignOut} = useContext(Context)
    //const [email, setEmail] = useState(state.user.attributes.email)
    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("@kkOO805")
    const [newPassword, setNewPassword] = useState('@kkOO805')
    const [confirmPassword, setConfirmPassword] = useState('@kkOO805')






    const onSubmit = event =>{
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            if(newPassword===confirmPassword){
                changePassword(password,newPassword,(err,result)=>{
                    if(err){
                        console.log('error: ',err)
                    }
                    else {
                        console.log(result)
                    }
                })
            }
            else{
                alert("Confirm Password!! ")
            }
        }
        setValidated(true);
    } 
    const LockImage = require("../../static/images/lock.png");
    return (
        <div>
            <br />
            <Container>
                <Row>
                    <Col md={8} sm={12}>
                        <Card >
                            <Card.Header><h2>Change Password</h2></Card.Header>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onSubmit}>
                                    <Form.Group controlId="formOldPassword">
                                    <Form.Label>Old Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                        required
                                        type="password"
                                        placeholder="Old Password"
                                        onChange={(event) => setPassword(event.target.value)}
                                        pattern=".{8,}"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                        Password not entered{" "}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formNewPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                        required
                                        type="password"
                                        placeholder="New Password"
                                        onChange={(event) => setNewPassword(event.target.value)}
                                        pattern=".{8,}"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                        Password not entered{" "}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formConfirmNewPassword">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                        required
                                        type="password"
                                        placeholder="Confirm Password"
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        pattern=".{8,}"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                        Password not entered{" "}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    </Form.Group>
                                    <Button style={{ width: "100%" }} variant="primary" type="submit" > Change Password </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Image src={LockImage} fluid />                    
                    </Col>
                </Row>
            </Container>
            
        </div>
    )
}

export default ChangePassword
