#!/usr/bin/env python3
import json
import time
import socket
import platform
from http.server import HTTPServer, BaseHTTPRequestHandler
import psutil

class SystemAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # 获取系统数据
        data = {
            "cpu": {
                "total": round(psutil.cpu_percent(interval=1), 1)
            },
            "mem": {
                "percent": round(psutil.virtual_memory().percent, 1)
            },
            "load": {
                "min1": round(psutil.cpu_percent() / 100 * psutil.cpu_count(), 2)
            },
            "system": {
                "hostname": socket.gethostname(),
                "os_name": f"{platform.system()} {platform.release()}"
            }
        }
        
        self.wfile.write(json.dumps(data).encode())
    
    def log_message(self, format, *args):
        pass  # 禁用日志输出

if __name__ == '__main__':
    server = HTTPServer(('localhost', 61208), SystemAPIHandler)
    print("系统监控API启动在 http://localhost:61208")
    server.serve_forever()
