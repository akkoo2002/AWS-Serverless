const AWS = require('aws-sdk')
const AWSRES = require('./awsres');

const SetComplete = function (user,callback){ 
    var paramsAttr = {
      UserAttributes: [ 
        {
          Name: 'profile', 
          Value: 'COMPLETE'
        },
      ],
      UserPoolId: AWSRES.COGNITO_USERPOOL_ID, 
      Username: user.username, 
    };
    var CIS = new AWS.CognitoIdentityServiceProvider();
    return CIS.adminUpdateUserAttributes(paramsAttr,callback).promise().then(res => paramsAttr).catch(err=> err);
}
const UpdateUser = async function (user,body,callback){ 
    var docClient = new AWS.DynamoDB.DocumentClient()
                
    var unTrimUpdateExpression ="set "
    var ExpressionAttributeValues={
            ":uid":user.profile
    }
    for (var [key, value] of Object.entries(body)) {
        unTrimUpdateExpression += key+" = :"+key+", "
        ExpressionAttributeValues[":"+key]=value;
    }
    var UpdateExpression = unTrimUpdateExpression.trim().replace(/(^,)|(,$)/g, "")
    
    const params = {
        TableName:AWSRES.DYNAMO_TABLE_USER,
        Key:{
            id:user.profile,
            email:user.email
        },
        ConditionExpression: "id = :uid",
        UpdateExpression,
        ExpressionAttributeValues
        // UpdateExpression: "set fullName = :fullName, gender = :gender",
        // ExpressionAttributeValues:{
        //     ":fullName":"akhtaraaaaaa",
        //     ":gender":"malaaaaae",
        //     ":uid":user.profile
        // },
    };
    return docClient.update(params,callback).promise().then(res => params).catch(err=> err)
};
const UserDetails = async(user,body,callback)=>{
    var paramsa = {
        TableName: AWSRES.DYNAMO_TABLE_USER,
        // ProjectionExpression: "id, email, userName",
        FilterExpression: "#id = :sub",
        ExpressionAttributeNames: {
            "#id": "id",
        },
        ExpressionAttributeValues: {
             ":sub": {"S":user.sub}
        }
    };
    
    
    var params = {
        TableName: AWSRES.DYNAMO_TABLE_USER,
        // ProjectionExpression: "id, email, userName",
        FilterExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id",
        },
        ExpressionAttributeValues: {
             ":id": {"S":user.profile}
        }
    };
    
    try{
        var dynamoDb = new AWS.DynamoDB();
        return dynamoDb.scan(params,(err,data)=>{
            const result ={}
            for (var [key, value] of Object.entries(data.Items[0])) {
                for (var [key1, value1] of Object.entries(value)) {
                    result[key]= value1
                }
            }
            callback(err,result);
        }).promise();
    }
    catch(error){
        callback(error,"");
        
    }
}
exports.funsSetDpPath = (user,dpPath,callback)=>{ 
    var docClient = new AWS.DynamoDB.DocumentClient()
    const params = {
        TableName:AWSRES.DYNAMO_TABLE_USER,
        Key:{
            id:user.profile,
            email:user.email
        },
        UpdateExpression: "set dpPath = :dpPath",
        ConditionExpression: "id = :uid",
        ExpressionAttributeValues:{
            ":dpPath":dpPath,
            ":uid":user.profile
        },
    };
    return docClient.update(params,callback).promise().then(res => params).catch(err=> err)
}
exports.userDetails = async(user,body,result)=>{
    await UserDetails(user,body,(err,data)=>{
        if(err){
            result.body = ""+JSON.stringify(err)
        }
        else{
            result.body = ""+JSON.stringify(data)
        }
    });
    return result
}
exports.register = async (user, body,result)=>{
    try{
        await UpdateUser(user,body,(err,data)=>{
            if(err){
                result.body = " "+JSON.stringify(err)
            }
            else{
                result.body = "register Success  "
            }
        })
    }
    catch(error){
        result.body = "register try fail"+error
    }
    return result
}
exports.allUsers = async(user,body,result)=>{
    await allUsers(user,body,(err,data)=>{
        if(err){
            result.body = ""+JSON.stringify(err)
        }
        else{
            result.body = ""+JSON.stringify(data)
        }
    });
    return result
}
const allUsers = async(user,body,callback)=>{
    var params = {
        TableName: AWSRES.DYNAMO_TABLE_USER,
        FilterExpression: "#role = :role",
        ExpressionAttributeNames: {
            "#role": "role",
        },
        ExpressionAttributeValues: {
             ":role": {"S":body.role}
        }
    };
    
    try{
        var dynamoDb = new AWS.DynamoDB();
        return dynamoDb.scan(params,(err,data)=>{
            var rsltList = []
            
            data.Items.forEach((item, index)=>{
                
                const result ={}
                for (var [key, value] of Object.entries(item)) {
                    for (var [key1, value1] of Object.entries(value)) {
                        result[key]= value1
                    }
                }
                rsltList.push(result)
            });
            callback(err,rsltList);
            //callback(err,data.Items);
        }).promise();
    }
    catch(error){
        callback(error,"");
        
    }
}