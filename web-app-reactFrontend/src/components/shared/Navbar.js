
import React, {useContext} from 'react';
import { Power ,CaretDownFill} from 'react-bootstrap-icons';
import {Context} from '../../contexts/Global.Context';
import {Link} from 'react-router-dom'//,useHistory.
import ROLES from '../../strings/roles'
import { Image,Navbar,Nav,NavDropdown, Button} from "react-bootstrap";
//https://icons.getbootstrap.com/
export default ()=> {
  const {logout,state} = useContext(Context);
  const siteLogo = require('../../static/images/siteLogo.png');
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="https://www.google.com/search?q=aws+serverless">
        <Image style={{height:"30px", objectFit:"contain" , marginRight:"10px"}} src={siteLogo} />
        AWS SLS
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" >
        <CaretDownFill/>
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">      
          {
            state.user.role===ROLES.ADMIN?
            (
              <>
              <Nav.Link as={Link} to="/admin/info">Account</Nav.Link>
              <Nav.Link as={Link} to="/admin/imageUpload">Image Upload</Nav.Link>
              <Nav.Link as={Link} to="/admin/signup">Add New Admin</Nav.Link>
              <Nav.Link as={Link} to="/admin/allUsers">Users List</Nav.Link>
              </>
            )
            :
            (
              <>
              <Nav.Link as={Link} to="/user/info">Account</Nav.Link>
              </>
            )
          }
        </Nav>
        <Nav>
          <NavDropdown title={state.user.attributes.fullName} id="collasible-nav-dropdown">
            <NavDropdown.Item as={Link} to="/shared/changePassword">Change Password</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/shared/register">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item  as={Button}  onClick={logout}> Logout <Power/></NavDropdown.Item>
          </NavDropdown>
          <Image style={{width:"50px",height:"50px" ,"marginRight":"10px"}} src={state.user.attributes.dpPath} roundedCircle />
        </Nav>
      </Navbar.Collapse>
    </Navbar>




    // <Navbar expand="lg">
    //   <Navbar.Brand href="#home">
    //   <Image style={{width:"50px",height:"50px" ,"marginRight":"10px"}} src={state.user.attributes.dpPath} roundedCircle />
    //   </Navbar.Brand>
    //   
    //   <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //   <Navbar.Collapse className="justify-content-end">
    //     <Nav className="mr-auto">
    
    //       
    //     </Nav>
    //   </Navbar.Collapse>
    // </Navbar>
  );
}

