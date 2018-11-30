const Nexmo = require('nexmo')
const express = require('express');
var request = require('request');
var requestSync = require('sync-request');


const nexmo = new Nexmo({
    apiKey : '', 
    apiSecret : '', 
    applicationId : '', 
    privateKey : ''
})

const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
const port = '8007'; 
const hostname = '127.0.0.1';
const FB_SENDER_ID = '';
//const FB_RECIPIENT_ID = '';
const VIBER_SERVICE_MESSAGE_ID = '';

const FB_RECIPIENT_DIC = {
    
};

const FROM_NUMBER = '';

server.post('/', function(req, res) {
    var ticketInfo = req.body;
    console.log(ticketInfo);
    
    var agent;
    agent = requestSync('GET', '');
    console.log(agent.getBody('utf8'));


    var agentModified = agent.getBody('utf8');
    console.log("agentModified: " + agentModified);
    console.log(typeof agentModified);

    var getAgentInfo = agentModified.split(":");

    console.log("agent: " + getAgentInfo);
    console.log("agent.phone: " + getAgentInfo[3]);
    var phone = getAgentInfo[3].slice(1, -2); 
    console.log("phone: " + getAgentInfo[3].slice(1, -2));
    console.log(getAgentInfo[1]);
    var email = getAgentInfo[1].slice(1, -8);
    console.log(email);


    if (`${ticketInfo.status}` == "NEW") {
        nexmo.dispatch.create("failover", [
            {
              "from": { "type": "messenger", "id": FB_SENDER_ID },
              "to": { "type": "messenger", "id": FB_RECIPIENT_DIC[email] },
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
            {
                "from": { "type": "viber_service_msg", "id": VIBER_SERVICE_MESSAGE_ID},
                "to": { "type": "viber_service_msg", "number": phone},
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
              "to": { "type": "sms", "number": phone},
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
              "to": { "type": "messenger", "id": FB_RECIPIENT_DIC[email] },
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
                "from": { "type": "viber_service_msg", "id": VIBER_SERVICE_MESSAGE_ID},
                "to": { "type": "viber_service_msg", "number": phone},
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
              "to": { "type": "sms", "number": phone},
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
