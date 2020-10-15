var nodemailer = require('nodemailer');
var GMAIL = require('./awsres');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: GMAIL.GMAIL_SENDER_ID,
       pass: GMAIL.GMAIL_SENDER_PASSWORD
    }
});
const mailOptions = {
    from: GMAIL.GMAIL_SENDER_ID, // sender address
    to: 'akkoo2002@gmail.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html herenew from lambda </p>'// plain text body
};

exports.handler = async function(event, context, callback) {     
    if(!event.to) callback(null,'Error! No  Mailto Address')
    else if(!event.subject) callback(null,'Error! No Subject')
    else if(!event.html) callback(null,'Error! No Mail Body')
    else{
        mailOptions.to=event.to    
        mailOptions.subject=event.subject
        mailOptions.html=event.html
        
        transporter.sendMail(mailOptions)
        callback(null,'finish')
    }
};




