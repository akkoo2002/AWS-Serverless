const AWS = require('aws-sdk');
var moment = require("moment-timezone");
var dynamoDb = new AWS.DynamoDB();
var AWSRES = require('./awsres');
var cognitoIdentityService = new AWS.CognitoIdentityServiceProvider();

const TableName =AWSRES.DYNAMO_TABLE_USER;
const CreateUser = function(Item,callback){ 

    var date = new Date();
    moment.tz.names();
    var timestr = moment(date.getTime()).tz("GMT0").format('YYYY-MM-DD:HH:MM:SS');
    
    const params = {
        TableName:TableName,
        Item:{
            'id':{"S":Item.request.userAttributes.profile},
            'email': {"S": Item.request.userAttributes.email },
            'poolRegion': {"S": Item.region },
            'userPoolId': {"S": Item.userPoolId },
            'email_verified': {"BOOL": false },
            // 'registration_completed': {"BOOL": false },
            'user_status': {"S": 'UNCONFIRMED' },
            'created_Date': {"S": timestr },
            'userName':{"S": Item.userName },
            'gender': {"S": Item.request.userAttributes.gender },
            'fullName': {"S": Item.request.userAttributes.name },
            'role': {"S": Item.request.userAttributes["custom:role"] },
        }
    };
  
    return dynamoDb.putItem(params,callback)
    .promise().then(res => params).catch(err=> err);
};

const CheckEmail = function(User,callback){ 
    var params = {
        TableName: TableName,
        // ProjectionExpression: "id, email, userName",
        FilterExpression: "#email = :male",
        ExpressionAttributeNames: {
            "#email": "email",
        },
        ExpressionAttributeValues: {
             ":male": {"S":User.email}
        }
    };
    return dynamoDb.scan(params,(err,data)=>{
          callback(err,data.Items);
    }).promise();
};

const CheckCogEmail = (User, callback) => {
  const params = {
      UserPoolId: AWSRES.COGNITO_REGION,
      Filter: `email = "${User.email}"`,
  };
  try {
      return cognitoIdentityService.listUsers(params,(err,data)=>{
          callback(err,data.Users);
      }).promise();
  }
  catch (error) {
      return null;
  }
};


exports.handler = async function(event, context, callback) {
    event.response.autoConfirmUser = false;
    let success = false;
    if(!event.request.userAttributes["custom:role"]){
        callback("\nRole Not Provided\n",{});
    }
    else if(event.request.userAttributes["custom:role"]==='admin'){
        if(!event.request.validationData.token){
             callback("\nNo Token To create Admin\n",{});
        }
        else
        {
            success = true;
        }
    }
    else if(event.request.userAttributes["custom:role"]==='user'){
        success = true;
    }
    else{
        callback("\nInvalid Role Provided\n",{});
    }
    
    if(success){
        var MatchedEmails= null;
        await CheckCogEmail(event.request.userAttributes,(err,data)=>{
            if(err){
                callback("\nChecking Email Failed\n"+err,{});
            }
            else{
                MatchedEmails = data;
            }
        });
        
        if(!MatchedEmails){
            callback("\nChecking Email Failed\n",{});
        }
        else 
        if(MatchedEmails.length>0 ){
            callback("\nUser Email Exists\n"+JSON.stringify(MatchedEmails[0]),{err:JSON.stringify(MatchedEmails[0])});
        }
        else{
            await CreateUser(event,(err,data)=>{
                if(err){
                    callback("\nCreating User Failed :"+err+"\n",{});
                }
                else{
                    callback(null, event);
                }
            });
        }
                    // callback(null, event);
    }
};



//event object
// {
//     "version":"1",
//     "region":"ap-south-1",
//     "userPoolId":"ap-south-1_u5jZlRQ7a",
//     "userName":"akkoodev",
//     "callerContext":{
//         "awsSdkVersion":"aws-sdk-unknown-unknown",
//         "clientId":"5u3tg724l438dukd2bg2arnqnc"
//     },
//     "triggerSource":"PreSignUp_SignUp",
//     "request":{
//         "userAttributes":{
//             "gender":"male",
//             "profile":"akkoodev-profile",
//             "name":"akkoo developer",
//             "nickname":"akkii",
//             "custom:role":"admin",
//             "email":"akkoodev@gmail.com"
//         },
//         "validationData":{
//             "name":"token"
//         }
//     },
//     "response":{
//         "autoConfirmUser":true,
//         "autoVerifyEmail":false,
//         "autoVerifyPhone":false
//     }
// } 