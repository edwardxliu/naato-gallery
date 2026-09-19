from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

ROOT = Path(__file__).parent
MIRROR = ROOT / "mirror"
PUBLIC = ROOT / "public"

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def translate_path(self, request_path):
        parsed = urlsplit(request_path)
        path = unquote(parsed.path)

        if path == "/_next/image":
            source = parse_qs(parsed.query).get("url", [""])[0]
            source = unquote(source).lstrip("/")
            candidate = (PUBLIC / source).resolve()
            if candidate.is_relative_to(PUBLIC.resolve()):
                return str(candidate)

        relative = path.lstrip("/")
        static = (PUBLIC / relative).resolve()
        if static.is_relative_to(PUBLIC.resolve()) and static.is_file():
            return str(static)
        if relative.startswith(("_next/", "vendor/")) or relative in {
            "offline.css", "offline-nav.js"
        }:
            return str(static)

        route = (MIRROR / relative / "index.html").resolve()
        if relative == "":
            route = MIRROR / "index.html"
        if route.is_relative_to(MIRROR.resolve()) and route.is_file():
            return str(route)

        return str(MIRROR / "index.html")

if __name__ == "__main__":
    print("Local exhibition site: http://127.0.0.1:4174")
    ThreadingHTTPServer(("127.0.0.1", 4174), Handler).serve_forever()
