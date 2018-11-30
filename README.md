# Zen
Zen is a project for internal Vonage Onahack hackathon and implements integration of Nexmo Messages and Dispatch APIs with our Zendesk for better support of our clients.

## Installation
```
pip install flask
pip install requests
brew install node
npm install nexmo
npm install express
npm install request
```

## Usage
```
python3 python/webhook.py
node agentOnCallWorkflow.js
node triggerWebhook.js
```
Expose all the used http ports for servers above through ngrok and update all the webhooks for application in Customer Dashboard, for Zendesk HTTP triggers and for Whatsapp Sandbox number as well.

## Our Team
Phil Holcombe

Svetlana Beliakova

Enric Jean

Alexander Fokin
