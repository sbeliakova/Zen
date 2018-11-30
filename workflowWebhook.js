const Nexmo = require('nexmo')
const express = require('express');


const nexmo = new Nexmo({
    apiKey : , 
    apiSecret : , 
    applicationId : , 
    privateKey : 
})

const server = express();
const bodyParser = require('body-parser');
const port = '8005'; 
const hostname = '127.0.0.1';
const FB_SENDER_ID = ;
const FB_RECIPIENT_ID = ;
const FROM_NUMBER = ;

server.post('/', function(req, res) {
    var ticketInfo = req.body;
    console.log(ticketInfo);
    nexmo.dispatch.create("failover", [
  {
    "from": { "type": "messenger", "id": "FB_SENDER_ID" },
    "to": { "type": "messenger", "id": "FB_RECIPIENT_ID" },
    "message": {
      "content": {
        "type": "text",
        "text" : `Hello from Nexmo Support! The ticket ${ticketInfo.ticketId} has been updated. The latest update was from  ${ticketInfo.assignee}. The latest comment: ${ticketInfo.latestComment}`
    }
    },
    "failover":{
      "expiry_time": 15,
      "condition_status": "read"
    }
  },
  {
    "from": {"type": "sms", "number": "FROM_NUMBER"},
    "to": { "type": "sms", "number": `${ticketInfo.requesterNumber}`},
    "message": {
      "content": {
        "type": "text",
        "text": "This is an SMS sent from the Dispatch API"
      }
    }
  },
  (err, data) => { console.log(data.dispatch_uuid); }
])
res.status(200).send("OK");
});


server.get('/', (req, res) => {
    res.status(200).send(req.body);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });