import os
import requests


def get_zendesk_creds():
    return (os.getenv('QA_ZENDESK_USER'),
            os.getenv('QA_ZENDESK_PASSWORD'))


def get_zendesk_user_by_number(number):
    """Searches for a user by mobile number using Zendesk API
    @param number: mobile number of the user from the WhatsApp message
    :return internal Zendesk userId
    """
    credentials = get_zendesk_creds()
    session = requests.Session()
    session.auth = credentials
    params = {
        'query': 'type:user phone:%s' % number
    }
    url = 'https://nexmo1443765028.zendesk.com/api/v2/search.json?'
    response = session.get(url, params=params)
    if response.status_code != 200:
        print('Status:', response.status_code, 'Problem with the request. Exiting.')
        raise ValueError('Error! Did not get 200 OK repsonse')
    data = response.json()
    if data['count'] == 0:
        raise ValueError("Error! There is no such user!")
    elif data['count'] > 1:
        raise ValueError("Error! More than one user with such number!")
    else:
        return data['results'][0]['id']


def get_zendesk_tickets_by_user(user_id):
    """Searches for all the tickets opened by a specific user
    @param user_id: internal Zendesk userId
    :return dictionary with user_id and list of tickers for this user
    """
    credentials = get_zendesk_creds()
    session = requests.Session()
    session.auth = credentials
    url = 'https://nexmo1443765028.zendesk.com/api/v2/users/%s/tickets/requested.json' % user_id
    response = session.get(url)
    if response.status_code != 200:
        print('Status:', response.status_code, 'Problem with the request. Exiting.')
        raise ValueError('Error! Did not get 200 OK response')

    data = response.json()
    return {'user_id': user_id, 'tickets': [ticket['id'] for ticket in data['tickets']]}


def append_zendesk_ticket(user_id, ticket_id, message):
    """Append an existing ticket
    @param user_id: internal Zendesk userId
    @param ticket_id: Zendesk ticket number
    @param message: user's text from received WhatsApp message
    """
    credentials = get_zendesk_creds()
    session = requests.Session()
    session.auth = credentials
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {"ticket": {"comment": {"body": message, "author_id": user_id}}}
    url = 'https://nexmo1443765028.zendesk.com/api/v2/tickets/%s.json' % ticket_id
    response = session.put(url, headers=headers, json=payload)
    if response.status_code != 200:
        print('Status:', response.status_code, 'Problem with the request. Exiting.')
        raise ValueError('Error! Did not get 200 OK response')


def create_zendesk_ticket(user_id, message):
    """Create a new Zendesk ticket
    @param user_id: internal Zendesk userId
    @param message: user's text from received WhatsApp message
    """
    credentials = get_zendesk_creds()
    session = requests.Session()
    session.auth = credentials
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {"ticket": {"subject": "Help!", "comment": {"body": message}, "requester_id": user_id,
                          "tags": ["fromwhatsapp"]}}
    url = 'https://nexmo1443765028.zendesk.com/api/v2/tickets.json'
    response = session.post(url, headers=headers, json=payload)
    if response.status_code != 201:
        print('Status:', response.status_code, 'Problem with the request. Exiting.')
        raise ValueError('Error! Did not get 201 Created response')
