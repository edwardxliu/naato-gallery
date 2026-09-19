from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path = Path(self.translate_path(self.path))
        if not path.exists() or path.is_dir() and not (path / "index.html").exists():
            self.path = "/index.html"
        return super().send_head()

if __name__ == "__main__":
    print("Local exhibition site: http://127.0.0.1:4174")
    ThreadingHTTPServer(("127.0.0.1", 4174), Handler).serve_forever()
