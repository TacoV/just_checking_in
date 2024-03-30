#!/bin/bash
source .env
if [ -z ${APP_URL+x} ]
then
    echo "Please set APP_URL in .env to your Firebase function URL, eg APP_URL=https://telegram-ckjew3asd1.a.run.app"
else 
    curl -d "url=${APP_URL}" "https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/setWebhook"
fi