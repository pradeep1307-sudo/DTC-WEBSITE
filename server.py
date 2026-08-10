from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import os
import re
from socketserver import ThreadingMixIn
from datetime import datetime, timedelta, timezone
from urllib.request import Request, urlopen
from xml.etree import ElementTree
UPCOMING_DIR = 'assets/upcoming'
GALLERY_DIR = 'assets/gallery'
YOUTUBE_FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNPyD_nYVLhC5-47771aGdw'
YOUTUBE_STREAMS_URL = 'https://www.youtube.com/@TamilChurchDenver/streams'


def load_streams_page_services():
    request = Request(YOUTUBE_STREAMS_URL, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    })
    page = urlopen(request, timeout=15).read().decode('utf-8', errors='replace')
    blocks = page.split('"lockupViewModel":')[1:]
    services = []
    seen = set()
    month_pattern = r'(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})\s+(\d{4})'
    for block in blocks:
        video_match = re.search(r'"contentId":"([a-zA-Z0-9_-]{11})"', block)
        if not video_match or video_match.group(1) in seen:
            continue
        title = None
        for encoded in re.findall(r'"content":"((?:[^"\\]|\\.)*)"', block[:30000]):
            try:
                candidate = json.loads(f'"{encoded}"')
            except json.JSONDecodeError:
                continue
            if 'sunday service' in candidate.lower():
                title = candidate
                break
        if not title:
            continue
        date_match = re.search(month_pattern, title, flags=re.IGNORECASE)
        if not date_match:
            continue
        published = datetime.strptime(date_match.group(0), '%B %d %Y') if len(date_match.group(1)) > 3 else datetime.strptime(date_match.group(0), '%b %d %Y')
        video_id = video_match.group(1)
        seen.add(video_id)
        services.append({
            'id': video_id,
            'title': title,
            'published': published.replace(tzinfo=timezone.utc).isoformat(),
            'url': f'https://www.youtube.com/watch?v={video_id}',
            'thumbnail': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
        })
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
            '/api/upcoming-events',
            '/assets/upcoming/events.json',
            '/assets/upcoming/manifest.json',
            '/assets/backgrounds/manifest.json',
            '/assets/pastor/manifest.json'
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
                try:
                    page_videos = load_streams_page_services()
                    known_ids = {video['id'] for video in videos}
                    videos.extend(video for video in page_videos if video['id'] not in known_ids)
                except Exception:
                    pass
                videos.sort(key=lambda video: video['published'], reverse=True)
                videos = videos[:9]
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
            manifest_path = os.path.join(UPCOMING_DIR, 'manifest.json')
            if os.path.isfile(manifest_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                with open(manifest_path, 'rb') as manifest:
                    self.wfile.write(manifest.read())
                return
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
        super().do_GET()
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


if __name__ == '__main__':
    port = 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadedHTTPServer(('0.0.0.0', port), Handler)
    print(f'Serving on http://localhost:{port}')
    server.serve_forever()
