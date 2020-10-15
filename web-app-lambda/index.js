const jwt = require('jsonwebtoken');
const fileUpload = require('./file_upload');
const registerUser = require('./userMgmt');
exports.handler = async (event,context)=> {    
    try{
    console.log("hello")
    var res ={
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        body:JSON.stringify(""
            +"      resource:"+event.resource
            +"      path:"+event.path
        )
    };
    
    var path = event.path;
    const httpMethod = event.httpMethod.toLowerCase()
    const body = JSON.parse(event.body)
    if(path){
        res.body = "got path";
        if(path.startsWith("/web-app-public")){
            path = path.replace('/web-app-public','')
            res.body = "got path public";
        }
        else if(path.startsWith("/web-app-private")){
            path = path.replace('/web-app-private','')
            res.body = "got path private";
            const decodedJWTToken = jwt.decode(event.headers.Authorization.split(' ')[1] , { complete: true });
            
            if(!decodedJWTToken){
                res.statusCode = 401;
                res.body = "No User";
            }
            else{
                res.body = "got user";
                const user = decodedJWTToken.payload
                user.role = decodedJWTToken.payload["custom:role"]
                user.username = decodedJWTToken.payload["cognito:username"]
                if(path==='/signedUrl'){
                    res.body = "executing signedUrl";
                    return fileUpload.signedUrl(user,body,res)
                }
                if(path==='/userDpUrl'){
                    res.body = "executing userDpUrl";
                    return fileUpload.userDpUrl(user,body,res)
                }
                if(path==='/userDetails'){
                    res.body = "executing userDetails";
                    const result = await registerUser.userDetails(user,body,res)
                    return result
                }
                if(path==='/allUsers'){
                    res.body = "executing allUsers";
                    const result = await registerUser.allUsers(user,body,res)
                    return result
                }
                else if(path==='/register' && httpMethod ==='post'){
                    res.body = "executing register "+ JSON.stringify(user);
                    const result = await registerUser.register(user,body,res)
                    return result
                }
                else{
                    res.body=user.role+" logged in"+path
                }
            }
        }
        else{
            res.body = "PAth not found";
        }
    }
    else{
        res.body = "Path error";
    }
    }
    catch (error) {
        //res.body = ""+JSON.stringify(error)
    }
    return res;
    //callback(null, res);
};





// const eventexample ={
//   resource: "/web-app-private/{path+}",
//   path: "/web-app-private/register",
//   httpMethod: "GET",
//   headers: {
//     accept: "application/json, text/plain, */*",
//     accept-encoding: "gzip, deflate, br",
//     accept-language: "en-US,en;q=0.5",
//     Authorization: "Bearer sdfgdfgdsfhfghdfgjhdfhjdfgdfgjdjfgjnjhgjgdjfgjdjhdghjsdjfdjdhjdjhgfhjdjhsdjfgjsdfhjdhjdfjdhjdhjdhg",
//     Host: "k3zs2niek9.execute-api.ap-south-1.amazonaws.com",
//     origin: "http://192.168.0.104:3000",
//     referer: "http://192.168.0.104:3000/admin/info",
//     User-Agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
//     X-Amzn-Trace-Id: "Root=1-5f7db27c-1c14aa0b363a986d750f2345",
//     X-Forwarded-For: "36.255.230.229",
//     X-Forwarded-Port: "443",
//     X-Forwarded-Proto: "https"
//   },
//   multiValueHeaders: {
//     accept: [
//       "application/json, text/plain, */*"
//     ],
//     accept-encoding: [
//       "gzip, deflate, br"
//     ],
//     accept-language: [
//       "en-US,en;q=0.5"
//     ],
//     Authorization: [
//       "Bearer "
//     ],
//     Host: [
//       "k3zs2niek9.execute-api.ap-south-1.amazonaws.com"
//     ],
//     origin: [
//       "http://192.168.0.104:3000"
//     ],
//     referer: [
//       "http://192.168.0.104:3000/admin/info"
//     ],
//     User-Agent: [
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0"
//     ],
//     X-Amzn-Trace-Id: [
//       "Root=1-5f7db27c-1c14aa0b363a986d750f2345"
//     ],
//     X-Forwarded-For: [
//       "36.255.230.229"
//     ],
//     X-Forwarded-Port: [
//       "443"
//     ],
//     X-Forwarded-Proto: [
//       "https"
//     ]
//   },
//   queryStringParameters: null,
//   multiValueQueryStringParameters: null,
//   pathParameters: {
//     path: "register"
//   },
//   stageVariables: null,
//   requestContext: {
//     resourceId: "yit4ht",
//     authorizer: {
//       principalId: "user",
//       integrationLatency: 75
//     },
//     resourcePath: "/web-app-private/{path+}",
//     httpMethod: "GET",
//     extendedRequestId: "UCjTaGLchcwFoWg=",
//     requestTime: "07/Oct/2020:12:20:12 +0000",
//     path: "/dev/web-app-private/register",
//     accountId: "693176431483",
//     protocol: "HTTP/1.1",
//     stage: "dev",
//     domainPrefix: "k3zs2niek9",
//     requestTimeEpoch: 1602073212173,
//     requestId: "1bc2c5ad-69e7-4b8e-be1d-b9f5d0c080f4",
//     identity: {
//       cognitoIdentityPoolId: null,
//       accountId: null,
//       cognitoIdentityId: null,
//       caller: null,
//       sourceIp: "36.255.230.229",
//       principalOrgId: null,
//       accessKey: null,
//       cognitoAuthenticationType: null,
//       cognitoAuthenticationProvider: null,
//       userArn: null,
//       userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
//       user: null
//     },
//     domainName: "k3zs2niek9.execute-api.ap-south-1.amazonaws.com",
//     apiId: "k3zs2niek9"
//   },
//   body: null,
//   isBase64Encoded: false
// }



// const contextexample={
//   "callbackWaitsForEmptyEventLoop": true,
//   "functionVersion": "$LATEST",
//   "functionName": "web-app-lambda",
//   "memoryLimitInMB": "128",
//   "logGroupName": "/aws/lambda/web-app-lambda",
//   "logStreamName": "2020/10/07/[$LATEST]9aeb90e02f8c470d9fdd21ec365ce3de",
//   "invokedFunctionArn": "arn:aws:lambda:ap-south-1:693176431483:function:web-app-lambda",
//   "awsRequestId": "b4df10b0-9ad7-48ac-970f-ff7c899e55c2"
// }