from flask import Flask, request, abort, jsonify
from python.zendesk_api import get_zendesk_tickets_by_user, get_zendesk_user_by_number, \
    append_zendesk_ticket, create_zendesk_ticket


app = Flask(__name__)

WHATSAPP_SANDBOX_NUMBER = '447418342149'
last_whatsapp_requests = []
last_inbound_messages = []
last_message_statuses = []


@app.route('/webhooks/inbound-message', methods=['GET', 'POST', 'DELETE'])
def webhook_for_inbound_message():
    """
    Webhook for Inbound Messages
    """
    global last_inbound_messages
    if request.method == 'POST':
        last_inbound_messages.append(request.json)
        return jsonify({'Status': 'Success'}), 200
    elif request.method == 'GET':
        if last_inbound_messages:
            return jsonify(last_inbound_messages), 200
        else:
            return jsonify({'Status': 'No previous request'}), 200
    elif request.method == 'DELETE':
        del last_inbound_messages[:]
        return jsonify({'Status': 'Success'}), 200
    else:
        abort(400)


@app.route('/webhooks/message-status', methods=['GET', 'POST', 'DELETE'])
def webhook_for_message_status():
    """
    Webhook for Messages' statuses
    """
    global last_message_statuses
    if request.method == 'POST':
        last_message_statuses.append(request.json)
        return jsonify({'Status': 'Success'}), 200
    elif request.method == 'GET':
        if last_message_statuses:
            return jsonify(last_message_statuses), 200
        else:
            return jsonify({'Status': 'No previous request'}), 200
    elif request.method == 'DELETE':
        del last_message_statuses[:]
        return jsonify({'Status': 'Success'}), 200
    else:
        abort(400)


@app.route('/webhooks/whatsapp', methods=['GET', 'POST', 'DELETE'])
def webhook_for_whatsapp_messages():
    """
    Webhook for Whatsapp Messages
    """
    global last_whatsapp_requests
    if request.method == 'POST':
        data = request.get_json(force=True)
        last_whatsapp_requests.append(data)
        if data['to']['number'] == WHATSAPP_SANDBOX_NUMBER:
            print("THIS IS MO MESSAGE")
            user_number = data['from']['number']
            user_message = data['message']['content']['text']
            tickets = get_zendesk_tickets_by_user(get_zendesk_user_by_number(str(user_number)))[
                'tickets']
            if len(tickets) == 0 or not any(str(ticket) in user_message for ticket in tickets):
                # create a new ticket
                create_zendesk_ticket(user_number, user_message)
            else:
                for ticket in tickets:
                    if str(ticket) in user_message:
                        # append a ticket
                        append_zendesk_ticket(user_number, ticket, user_message)
        return jsonify({'Status': 'Success'}), 200
    elif request.method == 'GET':
        if last_whatsapp_requests:
            return jsonify(last_whatsapp_requests), 200
        else:
            return jsonify({'Status': 'No previous request'}), 200
    elif request.method == 'DELETE':
        del last_whatsapp_requests[:]
        return jsonify({'Status': 'Success'}), 200
    else:
        abort(400)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8090)
