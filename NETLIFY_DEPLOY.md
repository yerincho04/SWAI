# Netlify Deploy Guide

This project can be deployed to Netlify as a static frontend.

Important:
- Netlify currently supports server-side Functions built with TypeScript, JavaScript, and Go.
- The current chatbot backend in `db_chatbot/` is Python, so it should be deployed separately.

## What Netlify will host

- `templatemo_607_glass_admin/index.html`
- CSS/JS assets
- copied brand JSON files in `templatemo_607_glass_admin/data`

## What must be deployed elsewhere

- the Python chatbot API from `db_chatbot/web_api.py`

Examples:
- Render
- Railway
- Fly.io
- your own VM/VPS

## Netlify steps

1. Push this project to GitHub.
2. In Netlify, create a new site from that GitHub repository.
3. Use these settings:
   - Build command: `python3 scripts/prepare_netlify.py`
   - Publish directory: `templatemo_607_glass_admin`
4. In Netlify site settings, add an environment variable:
   - `CHAT_API_URL`
   - value example: `https://your-backend.example.com/api/chat`
5. Trigger a deploy.

## Local development

Run the backend:

```bash
python3 db_chatbot/web_api.py
```

Then open `templatemo_607_glass_admin/index.html` with Live Server.

## Notes

- `scripts/prepare_netlify.py` copies the JSON data files into `templatemo_607_glass_admin/data`.
- the same script writes `templatemo_607_glass_admin/app-config.js` using the `CHAT_API_URL` environment variable.
