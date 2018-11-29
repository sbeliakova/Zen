const express = require('express');
const Nexmo = require('nexmo');
var request = require('request');


const nexmo = new Nexmo({
    apiKey : , 
    apiSecret : , 
    applicationId : , 
    privateKey : 
})

const server = express();
const bodyParser = require('body-parser');
const port = '8003'; 
const hostname = '127.0.0.1';
const WHATSAPP_NUMBER =  '';
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.post('/', function(req, res) {
    var ticketInfo = req.body;
    console.log(ticketInfo);
    console.log(ticketInfo.ticketId);
    console.log(ticketInfo.requesterNumber);
    var whatsappBody = [{ "type": "whatsapp", "number": ticketInfo.requesterNumber },
    { "type": "whatsapp", "number": WHATSAPP_NUMBER },
    {
      "content": {
        "type": "text",
        "text": "This is a WhatsApp Message sent from the Messages API"
      }
    }];

    console.log(whatsappBody);

    request.post(
        'https://sandbox.nexmodemo.com/v0.1/messages/',
        {    headers : {
            'Authorization' : '', 
            'Content-Type' : 'application/json'
            },
            json: {
            "from":{
               "type":"whatsapp",
               "number": WHATSAPP_NUMBER
            },
            "to":{
               "type":"whatsapp",
               "number": ticketInfo.requesterNumber
            },
            // "message":{
            //    "content":{
            //       "type":"template",
            //       "template":{
            //          "name":"8f90403f_80a2_a4d5_6c83_3af2f5732287:tracking_branch_opted_in_en_ar",
            //          "fallback_locale": "en_us",
            //          "parameters":[
            //             {
            //                "default": `The ticketID is ${ticketInfo.ticketId}` 
            //             },
            //             {
            //                "default": `From: ${ticketInfo.assignee}`
            //             },
            //             {
            //                "default": `The latest comment: ${ticketInfo.latestComment}`
            //             }
            //          ]
            //       }
            //    }
            // }

             "message": {
                 "content" : {
                     "type" : "text",
                     "text" : `Hello from Nexmo Support! The ticket ${ticketInfo.ticketId} has been updated. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
                 }
             }
        
     } 
    }
        ,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );

    res.status(200).send("OK");
});

server.get('/', (req, res) => {
    res.status(200).send(req.body);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});