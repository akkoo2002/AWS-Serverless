import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card,  Accordion,  Button,  Form,  Col,  InputGroup,  Alert,} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import ROLES from "../../strings/roles";
import { Context } from "../../contexts/Global.Context";

export default () => {
  const location = useLocation();

  const { state, authenticate, getSession } = useContext(Context);
  const [redirectTo, setRedirectTo] = useState(null);
  const [loginRole, setLoginRole] = useState(location.state &&location.state.role.includes(ROLES.ADMIN)? ROLES.ADMIN:ROLES.USER);
  
  const setRedirectAfterLogin = () => {
    if (state.user.isAuthenticated) {
      console.log("user is authenticated");
      let from = null;
      if (location.state) {
        console.log("got redirect");
        from = { from: location.state.from };
        if (!location.state.role.includes(state.user.role)) {
          console.log("not authorized redirect");
          from = null;
        }
      }
      if (!from) {
        if (state.user.role === ROLES.ADMIN) {
          console.log("setting redirct to admin base ");
          from = { from: { pathname: "/admin" } };
        } else if (state.user.role === ROLES.USER) {
          console.log("setting redirct to user base");
          from = { from: { pathname: "/user" } };
        } else {
          console.log("setting redirect to root");
          from = { from: { pathname: "/" } };
        }
      }
      console.log("setting redirecting", from.from.pathname);
      setRedirectTo(from);
    } else {
      console.log("user is Un-Authorized");
    }
  };
  const setAdminLogin = (e) => {
    setLoginRole(ROLES.ADMIN);    
  };
  const setUserLogin = () => {
    setLoginRole(ROLES.USER);
  };
  useEffect(() => {
    setRedirectAfterLogin();
  }, [state.user.isAuthenticated,loginRole]);

  function LoginForm(prop) {
    const [validated, setValidated] = useState(false);
    const [showError, setShowError] = useState(null);
    const [working, setWorking] = useState(false);
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
  function AlertDismissible() {

    if (showError) {
      return (
        <Alert
          style={{
            bottom: "0px",
            right: "0%",
            left: "0%",
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
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        onSubmit(event);
      }

      setValidated(true);
    };
    const onSubmit = (event) => {
      console.log("loginRole",loginRole)
      setShowError("Working..");
      event.preventDefault();
      setWorking(true)
      authenticate(email, password, loginRole)
        .then((data) => {
          getSession()
        })
        .catch((err) => {
            console.log("error: ", err.message);
            let disperr = err.message;
            if (err.message.trim().split("\n").length > 1) {
              disperr = err.message.split("\n")[1];
            }
            if(disperr==='invalid-role'){
              disperr='Not Authorized!!'
            }
            if(disperr==='User is not confirmed.'){
              disperr='Please verify our email'
            }

          setShowError("Login Failed - "+disperr);
          setTimeout(() => {
            setShowError(null);
          }, 2000);
          console.log("Admin Login Error:\n", err);
          setWorking(false)
        });
    };
    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Col} controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="E-Mail"
              aria-describedby="inputGroupPrepend"
              required
              onChange={(event) => setEmail(event.target.value)}
              defaultValue={email}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} controlId="validationCustom02">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              pattern=".{3,}"
              defaultValue={password}
            />
            <Form.Control.Feedback type="invalid">
              Password not entered{" "}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Row
            style={{
              margin: "10px"
            }}
        >
        <Col  md="6">
        <Button
            style={{
              width: "100%",
              marginTop:"10px"
            }}
          variant="primary"
          type="submit"
          disabled={working}
        >
          Log In
        </Button>
    </Col>
        {prop.formRole === ROLES.USER && (
          <Col md="6" >
          <Button
            style={{
              width: "100%",
              marginTop:"10px"
            }}
            variant="primary"
            disabled={working}
            href="/signup"
          >
            Sign Up
          </Button>
          </Col>
        )}
        </Form.Row>
        
        <AlertDismissible />
      </Form>
    );
  }
  const bgImage = require('../../static/images/login.png');
  return (
    <div className="card-container">

    <div className="bg-div" style={{"backgroundImage": `url(${bgImage})`}} ></div>
      {state.user.isAuthenticated && redirectTo ? (
        <Redirect to={redirectTo.from.pathname} />
      ) : (
        
    <Card  as={Col} md={6}>
    <Card.Header><h2>{loginRole === ROLES.ADMIN ? "Administrator " : "User "}Login Page</h2></Card.Header>
    <Card.Body>
        <Accordion  defaultActiveKey={loginRole} >
          <Card>
            <Accordion.Toggle
              onClick={setAdminLogin}
              as={Card.Header}
              variant="pill"
              eventKey={ROLES.ADMIN}
            >
              I Am Admin.
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={ROLES.ADMIN}>
              <div>
                <LoginForm formRole={ROLES.ADMIN} />
              </div>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              onClick={setUserLogin}
              as={Card.Header}
              variant="pill"
              eventKey={ROLES.USER}
            >
              I Am User.
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={ ROLES.USER}>
              <div>
                <LoginForm formRole={ROLES.USER} />
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
     
    </Card.Body>
    </Card> 
    )}
    </div>
  );
};
