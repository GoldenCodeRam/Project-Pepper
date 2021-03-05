# Simple-Image-Modifier

<p align="center">
  <kbd>
    <img src="https://www.vectorlogo.zone/logos/python/python-official.svg"/>
  </kbd>
</p>
<p align="center">
  A simple image modifier with Python, using HTTP Request API, and some other utilities for working with a server.
</p>

## Features

### 1. Image Quote Drawing

<p align="center">
  <img src="https://user-images.githubusercontent.com/46252493/104746146-e2297280-571c-11eb-933c-14dde8bc73f2.png"/>
</p>

The Simple Image Modifier takes an image, maybe from a middleware or other source, then look for a source of quotes, in this case a gist from **nasrulhazim**, that you can [find here](https://gist.github.com/nasrulhazim/54b659e43b1035215cd0ba1d4577ee80), that contain a simple list of quotes with its authors. Finally, using a Python library; [**Pillow**](https://pillow.readthedocs.io/en/stable/), the program writes the on top of the image the quote, the author and then returns the image to the middleware or the source.
