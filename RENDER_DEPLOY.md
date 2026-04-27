# Render Backend Deploy Guide

This project's chatbot backend can be deployed to Render as a Python Web Service.

## 1. Push your code to GitHub

Render deploys from a Git repository, so first make sure this project is pushed to GitHub.

## 2. Create a new Web Service

In Render:

1. Click `New`
2. Click `Web Service`
3. Connect your GitHub repo
4. Select the repository for this project

## 3. Use these Render settings

- Name: any name you like
- Root Directory: leave blank
- Runtime: `Python 3`
- Build Command:

```bash
pip install -r db_chatbot/requirements.txt
```

- Start Command:

```bash
HOST=0.0.0.0 python3 db_chatbot/web_api.py
```

## 4. Add environment variables

In the Render service's Environment settings, add:

- `OPENAI_API_KEY`
- `HOST`
  - value: `0.0.0.0`

You usually do not need to set `PORT` manually because Render provides it.

## 5. Deploy

After the first deploy, Render will give you a URL like:

```text
https://your-service-name.onrender.com
```

Your chatbot endpoint will be:

```text
https://your-service-name.onrender.com/api/chat
```

Your health endpoint will be:

```text
https://your-service-name.onrender.com/health
```

## 6. Connect Netlify frontend to Render backend

In Netlify, set this environment variable:

- `CHAT_API_URL=https://your-service-name.onrender.com/api/chat`

Then redeploy Netlify so `app-config.js` gets rebuilt with the Render URL.

## Notes

- Render requires public web services to bind to `0.0.0.0` and a Render-provided port.
- This app now reads `PORT` automatically in `db_chatbot/web_api.py`.
