## This bot

This Telegram bot, live as [@just_checking_in_bot](t.me/just_checking_in_bot),
helps you remind stuff or record stuff. Currently it's useable only as a thridaily
reminder to take your medications.

### Telegraf

The npm library to connect to Telegram.
Enables both the active sending of messages, as well as processing the incoming updates.

### Firestore

Googles NoSQL document store database.
Here, we save the requested schedules and the planned/asked/answered questions.

### Functions

Used on a schedule, for our own planning and asking of questions.
Used as an http endpoint, set as webhook for Telegram, for any Telegram incoming messages.