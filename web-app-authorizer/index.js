const jwt = require('jsonwebtoken');
const rp = require('request-promise');
const jwkToPem = require('jwk-to-pem');
const AWSRES = require('./awsres');

const getJWTTokenFromAuthHeader = (authHeader) => {
    if (!authHeader) {
        throw new Error('Could not find Auth Header');
    }
    if (authHeader.split(' ').length<2) {
        throw new Error('Auth Header currepted');
    }
    if (authHeader.split(' ')[0].toLowerCase()!='bearer') {
        throw new Error('Auth Header no Bearer');
    }
    const jwtToken = authHeader.split(' ')[1];
    if (!jwtToken) {
        throw new Error('Could not find JWT token in authToken');
    }
    return jwtToken;
}
const getFirstAuth0JWKSKey = (Auth0ApiBaseUrl) => {
    if (!Auth0ApiBaseUrl) {
        throw new Error('Auth0ApiBaseUrl is not set or empty');
    }
    return rp(Auth0ApiBaseUrl)
    .then((jwks) => {
        const jwksKey = JSON.parse(jwks).keys[0];
        if (!jwksKey) {
            throw new Error('No supported jwt keys');
        }
        return jwksKey;
    });
}
const verifyJWTToken = (decodedJWTToken, publicKey, alg) => {
    return new Promise((resolve, reject) => {
        jwt.verify(decodedJWTToken, publicKey, { algorithms: [alg] }, (error, data) => {
            error ? reject(error) : resolve(data);
        });
    });
};
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
      principalId
  };
  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke', // default action
        Effect: effect,
        Resource: resource
      }]
    }
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

exports.handler = async (event,context) => {
    const auth0BaseURL = "https://cognito-idp.ap-south-1.amazonaws.com/"+AWSRES.COGNITO_REGION+"/.well-known/jwks.json";
    const jwtToken = await getJWTTokenFromAuthHeader(event.authorizationToken);
    const firstAuth0JWKSKey = await getFirstAuth0JWKSKey(auth0BaseURL);
    const pem =  jwkToPem(firstAuth0JWKSKey);
    
    var polcy=null;
    
    await verifyJWTToken(jwtToken, pem, 'RS256')
    .then(response =>{
      polcy= generatePolicy('user', 'allow', event.methodArn);
    })
    .catch(error=>{
      polcy= generatePolicy('user', 'deny', event.methodArn);
    });
    return polcy;
};
