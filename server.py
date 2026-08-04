from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import os
from datetime import datetime, timedelta, timezone
from urllib.request import Request, urlopen
from xml.etree import ElementTree
CONTENT_FILE = 'content.json'
UPCOMING_DIR = 'assets/upcoming'
GALLERY_DIR = 'assets/gallery'
YOUTUBE_FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNPyD_nYVLhC5-47771aGdw'
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/gallery':
            extensions = ('.png', '.jpg', '.jpeg', '.webp')
            albums = []
            if os.path.isdir(GALLERY_DIR):
                for folder_name in sorted(os.listdir(GALLERY_DIR)):
                    folder_path = os.path.join(GALLERY_DIR, folder_name)
                    if not os.path.isdir(folder_path):
                        continue
                    images = [
                        f'assets/gallery/{folder_name}/{name}'
                        for name in sorted(os.listdir(folder_path))
                        if name.lower().endswith(extensions)
                    ]
                    albums.append({
                        'slug': folder_name,
                        'name': folder_name.replace('-', ' ').title(),
                        'images': images
                    })
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(albums, ensure_ascii=False).encode('utf-8'))
            return
        if self.path == '/api/youtube-videos':
            try:
                feed_request = Request(YOUTUBE_FEED_URL, headers={'User-Agent': 'Mozilla/5.0'})
                feed_root = ElementTree.fromstring(urlopen(feed_request, timeout=10).read())
                namespaces = {
                    'atom': 'http://www.w3.org/2005/Atom',
                    'yt': 'http://www.youtube.com/xml/schemas/2015'
                }
                cutoff = datetime.now(timezone.utc) - timedelta(days=60)
                videos = []
                for entry in feed_root.findall('atom:entry', namespaces):
                    published_text = entry.findtext('atom:published', default='', namespaces=namespaces)
                    published = datetime.fromisoformat(published_text.replace('Z', '+00:00'))
                    title = entry.findtext('atom:title', default='Previous service', namespaces=namespaces)
                    if published < cutoff or 'sunday service' not in title.lower():
                        continue
                    video_id = entry.findtext('yt:videoId', default='', namespaces=namespaces)
                    videos.append({
                        'id': video_id,
                        'title': title,
                        'published': published_text,
                        'url': f'https://www.youtube.com/watch?v={video_id}',
                        'thumbnail': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
                    })
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(videos, ensure_ascii=False).encode('utf-8'))
            except Exception as error:
                self.send_response(502)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(error)}).encode('utf-8'))
            return
        if self.path == '/api/upcoming-events':
            extensions = ('.png', '.jpg', '.jpeg', '.webp')
            files = []
            if os.path.isdir(UPCOMING_DIR):
                files = [
                    f'assets/upcoming/{name}'
                    for name in sorted(os.listdir(UPCOMING_DIR))
                    if name.lower().endswith(extensions)
                ]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(files).encode('utf-8'))
            return
        if self.path == '/api/content':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            with open(CONTENT_FILE, 'rb') as f:
                self.wfile.write(f.read())
        else:
            super().do_GET()
    def do_POST(self):
        if self.path == '/api/content':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            data = json.loads(body.decode('utf-8'))
            with open(CONTENT_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_error(404)
if __name__ == '__main__':
    port = 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = HTTPServer(('0.0.0.0', port), Handler)
    print(f'Serving on http://localhost:{port}')
    server.serve_forever()
