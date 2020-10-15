const index = require('./index')
index.handler(null,null,(err,res)=>{
    if(err){
        console.log("callback error:\n"+err);
    }
    else{
        console.log(res);
    }
})