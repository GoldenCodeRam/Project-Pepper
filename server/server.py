from http.server import BaseHTTPRequestHandler, HTTPServer
from requests_toolbelt import MultipartDecoder

from imageEditor import ImageEditor

hostName = "0.0.0.0"
serverPort = 8080

# Main Server Class
class Server(BaseHTTPRequestHandler):
  def do_GET(self):
    self._set_response()

  def do_POST(self):
    contentLength = int(self.headers['content-length'])
    postData = self.rfile.read(contentLength)
    decoder = MultipartDecoder(postData, self.headers['content-type'])
  
    image = ImageEditor(decoder.parts[0].content)

    self._set_response()
    self.wfile.write(image.getImageWithQuote())

  def _set_response(self):
    self.send_response(200)
    self.send_header('Content-type', 'multipart/form')
    self.end_headers()


if __name__ == "__main__":
  webServer = HTTPServer((hostName, serverPort), Server)
  print("Server started http://%s:%s" % (hostName, serverPort))
  webServer.serve_forever()