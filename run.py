"""
A1 Grand The Convention - Local Server Launcher
Run with: python run.py
"""

import os
import sys
import webbrowser
import socket
import http.server
import socketserver
import urllib.request
import time
import threading

# Force UTF-8 for console output on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8080

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def is_our_server(port):
    try:
        url = f"http://localhost:{port}/index.html"
        req = urllib.request.urlopen(url, timeout=1.5)
        if req.status == 200:
            return True
    except Exception:
        pass
    return False

def open_browser(url):
    time.sleep(0.6)
    print(f"\n[OK] Opening website in default browser: {url}\n")
    webbrowser.open(url)

def main():
    workspace = os.path.dirname(os.path.abspath(__file__))
    os.chdir(workspace)

    print("=" * 64)
    print("   [A1 GRAND THE CONVENTION - LOCAL WEB SERVER]   ")
    print("=" * 64)

    # Check if a server is already actively hosting the site
    if is_port_in_use(PORT) and is_our_server(PORT):
        url = f"http://localhost:{PORT}/"
        print(f"[OK] Server is already active at: {url}")
        open_browser(url)
        print("Launcher is monitoring the server. Press Ctrl+C to close.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nClosed.")
        return

    # Find next available port if 8080 is blocked by something else
    port = PORT
    while is_port_in_use(port):
        port += 1

    class CustomHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            # Disable caching completely during development
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()

    with socketserver.TCPServer(("", port), CustomHandler) as httpd:
        url = f"http://localhost:{port}/"
        print(f"[OK] Serving files from: {workspace}")
        print(f"[OK] Live URL:           {url}")
        
        threading.Thread(target=open_browser, args=(url,), daemon=True).start()

        print("\n[INFO] Server running! Press Ctrl+C in this terminal to stop.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server... Goodbye!")
            httpd.server_close()

if __name__ == "__main__":
    main()
