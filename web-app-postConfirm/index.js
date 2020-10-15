const AWS = require('aws-sdk')

const TableName =require('./awsres').DYNAMO_TABLE_USER

const UpdateUser = function(id,sub,email,callback){ 
    var docClient = new AWS.DynamoDB.DocumentClient()
    const params = {
        TableName:TableName,
        Key:{
            id:id,
            email:email
        },
        UpdateExpression: "set email_verified = :estate, user_status = :userstat, subid = :subid",
        ConditionExpression: "id = :uid",
        ExpressionAttributeValues:{
            ":userstat":"CONFIRMED",
            ":subid":sub,
            ":estate":true,
            ":uid":id
        },
    };
    return docClient.update(params,callback)
    .promise().then(res => params).catch(err=> err)
}


exports.handler = async function(event, context, callback) {
    await UpdateUser(
        event.request.userAttributes.profile,
        event.request.userAttributes.sub,
        event.request.userAttributes.email,
    )
    callback(null, event);
};






const inpostconfirm_event ={
        request:{
            "userAttributes":{
                    "sub":"13d282f0-31d5-4733-81ff-ea865d813d42",
                    "cognito:user_status":"CONFIRMED",
                    "email_verified":"true",
                    "cognito:email_alias":"akkoodev@gmail.com",
                    "gender":"male",
                    "profile":"60734603-121a-40ad-ae41-52a0e4e02871",
                    "name":"developer",
                    "custom:role":"user",
                    "email":"akkoodev@gmail.com",
                }
        },
        "callerContext":{
            "awsSdkVersion":"aws-sdk-unknown-unknown",
            "clientId":"5u3tg724l438dukd2bg2arnqnc",
        },
        "response":{ },
        "region":"ap-south-1",
        "userName":"akkoodev",
        "triggerSource":"PostConfirmation_ConfirmSignUp",
        "version":"1",
        "userPoolId":"ap-south-1_u5jZlRQ7a",
}
const inpostconfirm_context={
        "functionVersion":"$LATEST",
        "logGroupName":"/aws/lambda/web-app-post-confirm",
        "functionName":"web-app-post-confirm",
        "memoryLimitInMB":"128",
        "logStreamName":"2020/10/04/[$LATEST]0163ff2329624bf69de961f6faad64aa",
        "awsRequestId":"1e374792-9928-4756-a8ac-0c3c989e3b62",
        "invokedFunctionArn":"arn:aws:lambda:ap-south-1:693176431483:function:web-app-post-confirm",
        "callbackWaitsForEmptyEventLoop":true
}
