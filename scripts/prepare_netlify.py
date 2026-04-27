#!/usr/bin/env python3
"""Prepare static assets and runtime config for Netlify deploys."""

from __future__ import annotations

import json
import os
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT / "templatemo_607_glass_admin"
DATA_DIR = FRONTEND_DIR / "data"
SOURCE_DATA_DIR = ROOT / "db_chatbot" / "build_api_selected"
APP_CONFIG_PATH = FRONTEND_DIR / "app-config.js"

DATA_FILES = (
    "brand_master.json",
    "brand_year_stats.json",
    "brand_store_type_costs.json",
)


def copy_data_files() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    for filename in DATA_FILES:
        shutil.copy2(SOURCE_DATA_DIR / filename, DATA_DIR / filename)


def write_app_config() -> None:
    chat_api_url = os.environ.get("CHAT_API_URL", "http://127.0.0.1:8001/api/chat")
    payload = {"chatApiUrl": chat_api_url}
    APP_CONFIG_PATH.write_text(
        "window.APP_CONFIG = " + json.dumps(payload, ensure_ascii=False, indent=4) + ";\n",
        encoding="utf-8",
    )


def main() -> int:
    copy_data_files()
    write_app_config()
    print(f"Prepared Netlify assets in {FRONTEND_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
