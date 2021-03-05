import os
import urllib.request, json

from io import BytesIO
from random import Random

from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw

API_ENDPOINT = 'https://gist.githubusercontent.com/nasrulhazim/54b659e43b1035215cd0ba1d4577ee80/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json'

class ImageEditor:
  def __init__(self, image_bytes):
    self.imageBytes = image_bytes
    self.baseFolder = os.path.dirname(__file__)

  def getImageWithQuote(self):
    buffer = BytesIO(self.imageBytes)

    quote, author = self.getQuote()

    with Image.open(buffer) as image:
      imageWidth, imageHeight = image.size

      quoteFont = ImageFont.truetype(f'{self.baseFolder}/fonts/langar.ttf', int(imageWidth / 30))
      authorFont = ImageFont.truetype(f'{self.baseFolder}/fonts/andika.ttf', int(imageWidth / 30))

      draw = ImageDraw.Draw(image)
      draw.text(
        (int(0.025 * imageWidth), int(0.75 * imageHeight)),
        quote,
        (255, 255, 255),
        font=quoteFont
      )
      draw.text(
        (int(0.025 * imageWidth), int(0.85 * imageHeight)),
        author,
        (255, 255, 255),
        font=authorFont
      )
      
      return self.getImageBytes(image)

  def getImageBytes(self, image):
    imageBytes = BytesIO()
    image.save(imageBytes, format=image.format)

    return imageBytes.getvalue()

  def getQuote(self):
    with urllib.request.urlopen(API_ENDPOINT) as url:
      data = json.loads(url.read().decode())
      validQuotes = []

      for quote in data['quotes']:
        if(len(quote['quote']) < 61):
          validQuotes.append(quote)

      selectedQuote = Random.choice(Random(), validQuotes)
      return selectedQuote['quote'], selectedQuote['author']
      
