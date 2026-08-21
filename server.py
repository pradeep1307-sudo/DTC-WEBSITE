from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import os
import re
from socketserver import ThreadingMixIn
from urllib.request import Request, urlopen
UPCOMING_DIR = 'assets/upcoming'
GALLERY_DIR = 'assets/gallery'
YOUTUBE_STREAMS_URL = 'https://www.youtube.com/@TamilChurchDenver/streams'


def load_streams_page_services():
    request = Request(YOUTUBE_STREAMS_URL, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    })
    page = urlopen(request, timeout=15).read().decode('utf-8', errors='replace')
    services = []
    seen = set()
    records = []
    for block in page.split('"lockupViewModel":')[1:]:
        video_match = re.search(r'"contentId":"([a-zA-Z0-9_-]{11})"', block)
        if not video_match:
            continue
        title_match = re.search(r'"content":"((?:[^"\\]|\\.)*)"', block[:40000])
        title = None
        if title_match:
            try:
                title = json.loads(f'"{title_match.group(1)}"')
            except json.JSONDecodeError:
                pass
        records.append((video_match.group(1), title))
    if not records:
        records = [(video_id, None) for video_id in re.findall(r'"(?:videoId|contentId)":"([a-zA-Z0-9_-]{11})"', page)]
    for video_id, title in records:
        if video_id in seen:
            continue
        seen.add(video_id)
        services.append({
            'id': video_id,
            'title': title or ('Latest Live Service' if not services else 'Previous Live Service'),
            'published': '',
            'url': f'https://www.youtube.com/watch?v={video_id}',
            'thumbnail': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
        })
        if len(services) == 9:
            break
    return services


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        request_path = self.path.split('?', 1)[0]
        if request_path == '/' or request_path.endswith('.html') or request_path in {
            '/admin/',
            '/admin/index.html',
            '/admin.html',
            '/index.html',
            '/admin/admin.css',
            '/js/admin.js',
            '/js/script.js',
            '/js/events.js',
            '/sermon-notes.html',
            '/styles.css',
            '/design-system.css',
            '/app-theme.css',
            '/api/upcoming-events',
            '/assets/upcoming/events.json',
            '/assets/upcoming/manifest.json',
            '/assets/backgrounds/manifest.json',
            '/assets/pastor/manifest.json',
            '/assets/missions/manifest.json',
            '/assets/ministries/manifest.json',
            '/assets/quick-info/manifest.json'
        }:
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/api/gallery':
            manifest_path = os.path.join(GALLERY_DIR, 'manifest.json')
            if os.path.isfile(manifest_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                with open(manifest_path, 'rb') as manifest:
                    self.wfile.write(manifest.read())
                return
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
                videos = load_streams_page_services()
                if not videos:
                    raise ValueError('No videos were found on the YouTube Live tab')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(videos, ensure_ascii=False).encode('utf-8'))
            except Exception as error:
                # The Live page falls back to the channel uploads playlist.
                # Return an empty successful feed during temporary upstream
                # failures so the rest of the local app remains healthy.
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(b'[]')
            return
        if self.path == '/api/upcoming-events':
            events_path = os.path.join(UPCOMING_DIR, 'events.json')
            manifest_path = os.path.join(UPCOMING_DIR, 'manifest.json')
            extensions = ('.png', '.jpg', '.jpeg', '.webp')
            events = []
            posters = []
            if os.path.isfile(events_path):
                with open(events_path, encoding='utf-8') as event_file:
                    events = json.load(event_file)
            if os.path.isfile(manifest_path):
                with open(manifest_path, encoding='utf-8') as manifest_file:
                    posters = json.load(manifest_file)
            elif os.path.isdir(UPCOMING_DIR):
                posters = [
                    f'assets/upcoming/{name}'
                    for name in sorted(os.listdir(UPCOMING_DIR))
                    if name.lower().endswith(extensions)
                ]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.end_headers()
            self.wfile.write(json.dumps({'events': events, 'posters': posters}, ensure_ascii=False).encode('utf-8'))
            return
        super().do_GET()
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


if __name__ == '__main__':
    port = 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadedHTTPServer(('0.0.0.0', port), Handler)
    print(f'Serving on http://localhost:{port}')
    server.serve_forever()
