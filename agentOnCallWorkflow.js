const Nexmo = require('nexmo')
const express = require('express');

const nexmo = new Nexmo({
    apiKey : '', 
    apiSecret : '', 
    applicationId : '', 
    privateKey : ''
})

const nexmoVoice = new Nexmo({
    apiKey : '', 
    apiSecret : '', 
    applicationId : '', 
    privateKey : ''
})

const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
const port = '8006'; 
const hostname = '127.0.0.1';
const FB_SENDER_ID = '';
const FB_RECIPIENT_ID = '';
const FROM_NUMBER = '';
const AGENT_NUMBER = '';


server.post('/', function(req, res) {
    var ticketInfo = req.body;
    console.log(ticketInfo);

//     var NCCO = [
//         {
//           "action": "talk",
//           "voiceName": "Amy",
//           "text" : "Please check your Zendesk app. There is an update about your P1 ticket"
//         //   "text" : `The ticket ${ticketInfo.ticketId} has been created. The priority is ${ticketInfo.priority}. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
//         }
//     ];

//     nexmoVoice.calls.create({
//     to: [{
//       type: 'phone',
//       number: AGENT_NUMBER
//     }],
//     from: {
//       type: 'phone',
//       number: FROM_NUMBER
//     },
//     answer_url: ["https://api.myjson.com/bins/zrfve"]
//   });

    if (`${ticketInfo.status}` == "NEW") {
        nexmo.dispatch.create("failover", [
            {
              "from": { "type": "messenger", "id": FB_SENDER_ID },
              "to": { "type": "messenger", "id": FB_RECIPIENT_ID },
              "message": {
                "content": {
                  "type": "text",
                  "text" : `The ticket ${ticketInfo.ticketId} has been created. The priority is ${ticketInfo.priority}. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
              }
              },
              "failover":{
                "expiry_time": 15,
                "condition_status": "read"
              }
            },
            // {
            //     "from": { "type": "viber_service_msg", "id": "VIBER_SERVICE_MESSAGE_ID"},
            //     "to": { "type": "viber_service_msg", "number": `${ticketInfo.requesterNumber}`},
            //     "message": {
            //       "content": {
            //         "type": "text",
            //         "text": "This is a Viber Service Message sent from the Dispatch API"
            //       }
            //     },
            //     "failover":{
            //       "expiry_time": 600,
            //       "condition_status": "delivered"
            //     }
            //   },
            {
              "from": {"type": "sms", "number": FROM_NUMBER},
              "to": { "type": "sms", "number": AGENT_NUMBER},
              "message": {
                "content": {
                  "type": "text",
                  "text" : `The ticket ${ticketInfo.ticketId} has been created. The priority is ${ticketInfo.priority}. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
                }
              }
            },
            (err, data) => { console.log(data.dispatch_uuid); }
          ])
    } else {
        nexmo.dispatch.create("failover", [
            {
              "from": { "type": "messenger", "id": FB_SENDER_ID },
              "to": { "type": "messenger", "id": FB_RECIPIENT_ID },
              "message": {
                "content": {
                  "type": "text",
                  "text" : `The ticket ${ticketInfo.ticketId} has been updated. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
              }
              },
              "failover":{
                "expiry_time": 15,
                "condition_status": "read"
              }
            },
            {
              "from": {"type": "sms", "number": FROM_NUMBER},
              "to": { "type": "sms", "number": `${ticketInfo.requesterNumber}`},
              "message": {
                "content": {
                  "type": "text",
                  "text" : `The ticket ${ticketInfo.ticketId} has been updated. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
                }
              }
            },
  (err, data) => { console.log(data.dispatch_uuid); }
])}


res.status(200).send("OK");
});


server.get('/', (req, res) => {
    console.log(req.body);
    res.status(200).send(req.body);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
