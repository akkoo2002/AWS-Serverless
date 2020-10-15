exports.handler = (event, context, callback) => {
    //if(event.request.userNotFound)
        //callback("\nUser Not Found\n", event);
    if(event.request.userAttributes['custom:role'] === event.request.validationData.role)
        callback(null, event);
    else
        callback("\ninvalid-role\n"+JSON.stringify(event.request), event);
};


// event oject
// {
//     "version":"1",
//     "region":"ap-south-1",
//     "userPoolId":"ap-south-1_u5jZlRQ7a",
//     "userName":"akkoodev",
//     "callerContext":{
//         "awsSdkVersion":"aws-sdk-unknown-unknown",
//         "clientId":"5u3tg724l438dukd2bg2arnqnc"
//     },
//     "triggerSource":"PreAuthentication_Authentication",
//     "request":{
//         "userAttributes":{
//             "sub":"327642c6-9cff-433a-8776-f75f3ebf0678",
//             "email_verified":"false",
//             "cognito:user_status":"CONFIRMED",
//             "gender":"male",
//             "profile":"akkoodev-profile",
//             "nickname":"akkii",
//             "name":"akkoo developer",
//             "custom:role":"admin",
//             "email":"akkoodev@gmail.com"
//         },
//         "validationData":{
//              "role":"admin",
//              "account":"open"
//         },
//         "userNotFound":false
//     },
//     "response":{
//     }
// }


// context object
// {
//     "callbackWaitsForEmptyEventLoop":true,
//     "functionVersion":"$LATEST",
//     "functionName":"web-app-preAuth",
//     "memoryLimitInMB":"128",
//     "logGroupName":"/aws/lambda/web-app-preAuth",
//     "logStreamName":"2020/10/02/[$LATEST]da15c779ecc04d938e4a925438bc4039",
//     "invokedFunctionArn":"arn:aws:lambda:ap-south-1:693176431483:function:web-app-preAuth",
//     "awsRequestId":"df5fdf24-239f-4607-8254-72b961677240"
// }