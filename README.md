## This bot

This Telegram bot, currently live as
[@just_checking_in_bot](https://t.me/just_checking_in_bot), helps you remind
stuff or record stuff. Currently it's useable only as a thridaily reminder to
take your medications.

Although it is publicly available (source and bot), in the current state it will
not be useful to most people.

### Basic functionality

Users configure the bot from a telegram conversation, either 1-on-1 with the bot
or from a group with the bot. They request reminders on a schedule, that gets
saved in the **schedules** collection in Firestore. Every couple of minutes, a
scheduled job uses the schedules to prepare and plan future questions in the
**questions** collection. Then, it checks for any planned questions and asks
them in the conversation that requested the schedule in the first place.

From there, the user can answer via an inline keyboard and the Telegram webhook
saves the answer on the question in the collection.

Future functionality could include:

* Different schedules, eg random points within intervals
* Recurring actions, eg when answereing "No" to a reminder, remind again in x
minutes
* Processing of the results, eg to find a correlation between different answers
* Better insight and management of current schedules, eg seeing what's enabled
and adjusting it, instead of only blindly clearing it
* A better test method, eg "/once" to get 1 question
* Processing of paramaters, eg "/remind <when> <what>" instead of only having it
pre-programmed

### Components

#### Telegraf

The npm library to connect to Telegram. Enables both the active sending of
messages, as well as processing the incoming updates.

#### Firestore

Googles NoSQL document store database. Here, we save the requested schedules and
the planned/asked/answered questions.

#### Functions

Used on a schedule, for our own planning and asking of questions. Used as an
http endpoint, set as webhook for Telegram, for any Telegram incoming messages.

### Installation

`firebase use --add`

