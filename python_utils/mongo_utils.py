"""Python based utilities for the registration system."""

import os
import json
from urllib.parse import quote_plus
from functools import lru_cache

import pymongo

from mail_utils import send_email


CRED_DIR_PATH = os.path.expanduser('~/.datahack/')
CRED_FNAME = 'mongodb_credentials.json'


def _get_credentials():
    fpath = os.path.join(CRED_DIR_PATH, CRED_FNAME)
    with open(fpath, 'r') as cred_file:
        return json.load(cred_file)


MONGODB_URI = "mongodb://{usr}:{pwd}@{host}:{port}"


def _get_mongodb_uri():
    cred = _get_credentials()
    return MONGODB_URI.format(
        usr=quote_plus(cred['usr']),
        pwd=quote_plus(cred['pwd']),
        host=cred['host'],
        port=cred['port'],
    )


@lru_cache(maxsize=2)
def _get_mongodb_client():
    cred = _get_credentials()
    return pymongo.MongoClient(
        host=_get_mongodb_uri(),
        authSource=cred['authSource'],
    )


def _get_mongo_database():
    return _get_mongodb_client()['datahack']


CONFIRM_STR = 'confirmation_email'


def _print_email_stats():
    users = _get_mongo_database()['users']
    print("Emails stas on DataHack 2017 registration:")
    print("{} total users in the system.".format(users.count()))
    print("{} users got a confirmation email.".format(
        users.count({CONFIRM_STR: True})))


def _set_confirmation_email_true(emails):
    users = _get_mongo_database()['users']
    users.update_many(
        filter={'email': {'$in': emails}},
        update={'$set': {CONFIRM_STR: True}},
    )


CONFIRM_MSG = (
    "This is a message confirming you registration form for DataHack 2017"
    " has been processed.\n This does not confirm your participation in the"
    " event. Confirmation emails for participation will go out at a later"
    " date."
)


def _send_confirmation_email(emails):
    print("Sending a confirmation email to the following addresses:")
    print(emails)
    send_email(
        from_addr="contact@datahack-il.com",
        to_addrs=["contact@datahack-il.com"],
        cc_addrs=[],
        bcc_addrs=emails,
        subject="Your registration for DataHack 2017 is confirmed!",
        msg=CONFIRM_MSG,
    )
    print("Email sent successfully")
    _set_confirmation_email_true(emails)
    print('Users marked as confirmed on MongoDB\n')


ZOHO_MAX_RECIPIENTS = 50
ZOHO_MAX_DAILY_MAILS = 150


def send_confirmation_emails(limit=None):
    _print_email_stats()
    print("Sending confirmation emails to all non-confirmed users.")
    users = _get_mongo_database()['users']
    users_to_send = users.find({CONFIRM_STR: {'$ne': True}})
    batch = []
    total = 0
    while True:
        try:
            user = users_to_send.__next__()
            total += 1
        except StopIteration:
            if len(batch) > 0:
                _send_confirmation_email(batch)
            break
        batch.append(user['email'])
        if len(batch) == ZOHO_MAX_RECIPIENTS:
            _send_confirmation_email(batch)
            batch = []
    print("\n===========\n{} confirmation emails were sent.".format(total))
