import React,{useContext,useState} from 'react'
import {Context,REDUCERS} from '../../contexts/Global.Context';
import axios from 'axios'
import RES from '../../strings/AWS-Resources'

export default ()=> {
    const[status, setStatus] = useState("No Url")
    const[downloadUrl, setDownloadUrl] = useState('')
    const {state,dispatch} = useContext(Context);

    const UploadFile = (files) => {
        const file = files[0];
        const folder = '/images/system'
        const accessToken = state.user.jwtToken

        console.log("Selected File :\n",file)
        setStatus("Getting URL");
        setDownloadUrl(RES.WEBSITE_DOMAIN+folder+'/'+ file.name);
        axios('/signedUrl ',  {
            baseURL:RES.AWS_API_PRIVATE,
            method: 'post',
            headers:{
                Authorization: accessToken? 'Bearer '+accessToken : 'Bearer'
            },
            data: {
                filename: state.user.role+"_bgImage.jpg",//file.name,
                folder: folder,
                bucket: RES.WEBSITE_S3_BUCKET_NAME,
                region: RES.WEBSITE_S3_BUCKET_REGION
            }
          })
          .then(response =>{
            console.log("Signed url Reponse Data :\n",response.data)
              setStatus("Uploading File");

              axios.put(response.data.uploadUrl, files[0])
              .then((response) => {
                dispatch({type: REDUCERS.SET_BG_IMAGE, payload: null});
                  console.log("File Upload Success :\n",response)
                  setStatus("File Uploaded Success");
              })
              .catch(error=>{
                  console.log("File Upload Error :\n",error)          
                  setStatus("File Uploaded Error");
              })
          })
          .catch(error=>{
              console.log("Signed Url Error :\n",error) 
              setStatus("Failed url");
          })

    }
    return (
        <div style={{display:"flex", height: "100%",  alignItems: "center","justify-content": "center"}}>            
            <label style={{ width: "50%" }} className="btn btn-lg btn-primary">
                <input type="file" onChange={event=>UploadFile(event.target.files)} />
                <span>Select Picture</span>
            </label>
        </div>
    )
}







// import React, { Component } from 'react';
// import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
// import axios from 'axios';

// const UserPoolId = 'xxx';
// const ClientId = 'yyy';
// const ApiGatewayUrl = 'zzz';

// const userPool = new CognitoUserPool({
//   UserPoolId: UserPoolId,
//   ClientId: ClientId,
// });

// export default class App extends Component {


//   onSubmit = (event) => {
//     event.preventDefault();

//     let cognitoUser = new CognitoUser({
//       Username: this.state.username,
//       Pool: userPool,
//     });

//     const authenticationDetails = new AuthenticationDetails({
//       Username: this.state.username,
//       Password: this.state.password,
//     });

//     cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: this.onSuccess,
//         onFailure: this.onFailure,
//         newPasswordRequired: (userAttributes, requiredAttributes) => {
//           console.log("newPasswordRequired");
//           console.log(userAttributes);

//           // not interesting for this demo - add a bogus e-mail and append an X to the initial password
//           userAttributes['email'] = 'justtesting@email.com';
//           cognitoUser.completeNewPasswordChallenge(this.state.password + 'X', userAttributes, this);
//         },
//     });
//   };

//   onDrop = (files) => {
//     axios.get(ApiGatewayUrl, {headers: {Authorization: this.state.accessToken}}).then((response) => {
//       axios.put(response.data, files[0]).then((response) => {
//         this.setState({
//           statusCode: response.status,
//         });
//       });
//     });
//   };

//   render() {
//     return (
//       <div>
//         <h1>Login to upload files</h1>
//         <form onSubmit={this.onSubmit}>
//           <input type='text' value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} placeholder='username' /><br />
//           <input type='password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} placeholder='password' /><br />
//           <input type='submit' value='Login' />
//         </form>
//         <p style={{color: 'red', display: this.state.isLoginFailed ? 'block' : 'none'}}>Credentials incorrect</p>
//         <div style={{display: this.state.user.isAuthenticated ? 'block' : 'none'}}>
//           <Dropzone onDrop={this.onDrop}>
//             <p>Drop your files here or click to select one.</p>
//           </Dropzone>
//           <p>Status Code: {this.state.statusCode}</p>
//         </div>
//       </div>
//     );
//   };
// };
