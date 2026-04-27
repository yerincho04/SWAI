#!/usr/bin/env python3
"""Tiny local web API for the DB chatbot."""

from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from chat_app import run_once


ROOT = Path(__file__).resolve().parent.parent
BUILD_DIR = ROOT / "db_chatbot" / "build_api_selected"
API_DATA_ROOT = ROOT / "db_chatbot" / "api_data"


class ChatHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/health":
            self._send_json({"ok": True, "service": "db_chatbot"})
            return
        self._send_json({"error": "Not found."}, status=404)

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/chat":
            self._send_json({"error": "Not found."}, status=404)
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)
            payload = json.loads(raw_body.decode("utf-8") or "{}")
        except Exception as exc:  # noqa: BLE001
            self._send_json({"error": f"Invalid request body: {exc}"}, status=400)
            return

        query = str(payload.get("query") or "").strip()
        brand_name = str(payload.get("brand_name") or "").strip()
        model = str(payload.get("model") or "gpt-4.1-mini").strip()

        if not query:
            self._send_json({"error": "Missing query."}, status=400)
            return

        full_query = query
        if brand_name and brand_name not in query:
            full_query = f"{brand_name} 브랜드 기준으로 답변해줘. 질문: {query}"

        try:
            answer = run_once(
                full_query,
                model=model,
                source_mode="build",
                build_dir=BUILD_DIR,
                api_data_root=API_DATA_ROOT,
            )
        except Exception as exc:  # noqa: BLE001
            self._send_json({"error": str(exc)}, status=500)
            return

        self._send_json({"answer": answer, "brand_name": brand_name})


def main() -> int:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8001"))
    server = ThreadingHTTPServer((host, port), ChatHandler)
    print(f"DB chatbot API running at http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
