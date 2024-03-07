#!/bin/bash
source .env
curl -d "url=https://telegram-fsab3xrgqq-uc.a.run.app" "https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/setWebhook"