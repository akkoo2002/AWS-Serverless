const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const UserMgmt = require('./userMgmt');
const AWSRES = require('./awsres');




exports.signedUrl = (user, body, result)=>{
    // if(role!='admin'){
    //     result.statusCode = 401
    //     result.body = "UnAuthorized"
    //     return result;
    // }
    
    const bucket =body.bucket
    const folder = body.folder
    const filename = body.filename;
    const region  = body.region
    
    const s3Param = {
        Bucket:bucket+folder,
        Key:filename,
        //ContentType:'image/jpeg',
        //Expires: 90, //Seconds
        // ACL:'public-read'
    }
    const s3ReadParam = {
        Bucket:bucket+folder,
        Key:filename,
        Expires: 30  //Seconds
    }
    try {
        result.statusCode = 200
        result.body =  JSON.stringify({
                'uploadUrl':s3.getSignedUrl('putObject',s3Param),
                'downloadUrl':s3.getSignedUrl('getObject',s3ReadParam),
                publicUrl:"https://"+bucket+".s3."+region+".amazonaws.com"+folder+"/"+filename
        })
        
    } catch (error) {
        result.statusCode = 500
        result.body = JSON.stringify(error)
    }
    return result
}

exports.userDpUrl = async (user, body, result)=>{
    
    const bucket =body.bucket
    const folder = body.folder
    const fileExtn = body.fileExtn;
    const region  = body.region
    let ts = Date.now();
    const filename = "dpImage_"+user.sub+'.'+fileExtn;
    const s3Param = {
        Bucket:bucket+folder,
        Key:filename,
        //ContentType:'image/jpeg',
        //Expires: 90, //Seconds
        // ACL:'public-read'
    }
    const s3ReadParam = {
        Bucket:bucket+folder,
        Key:filename,
        Expires: 30  //Seconds
    }
    try {
        result.statusCode = 200
        const uploadUrl=s3.getSignedUrl('putObject',s3Param)
        const downloadUrl= s3.getSignedUrl('getObject',s3ReadParam)
        const publicUrl="https://"+bucket+".s3."+region+".amazonaws.com"+folder+"/"+filename

        result.body =  JSON.stringify({uploadUrl, downloadUrl,publicUrl})
        
        await UserMgmt.funsSetDpPath(user,publicUrl ,(err,data)=>{
            if(err){
                result.statusCode = 401
                result.body = ""+JSON.stringify(err)
            }
        })
    } catch (error) {
        result.statusCode = 500
        result.body = JSON.stringify(error)
    }
    return result
}

// //const Responses = require('./common/API_Responses');
// const AWS = require('aws-sdk');
// const aws3 = new AWS.S3()

// const Responses = {
//     _DefineResponse(statusCode = 502, data = {}) {
//         return {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Methods': '*',
//                 'Access-Control-Allow-Origin': '*',
//             },
//             statusCode,
//             body: JSON.stringify(data),
//         };
//     },

//     _200(data = {}) {
//         return this._DefineResponse(200, data);
//     },

//     _204(data = {}) {
//         return this._DefineResponse(204, data);
//     },

//     _400(data = {}) {
//         return this._DefineResponse(400, data);
//     },
//     _404(data = {}) {
//         return this._DefineResponse(404, data);
//     },
// };

// exports.handler = async (event) => {
//     try{
//         const bucket ='react-cognito-test-akkoo';

//         let imageData =event.body;// body.image

//         const buffer = Buffer.from(imageData,'base64')

//         const key = `banner.jpg`
//         console.log('writing to s3')
//         await aws3.putObject({
//             Body:buffer,
//             Key:key,
//             ContentType:'image/jpeg',
//             Bucket:bucket,
//             ACL:'public-read'
//         }).promise();
//         const URL = `https://${bucket}.s3.ap-south-1.amazonaws.com/${key}`
//         return Responses._200({
//             imageURL:URL,
//             event
//         })
//     }
//     catch(error){
//         console.log('error by fileupload:\n',error)
//         return Responses._400({message: error.message || 'Failed to upload'})
//     }
// };
