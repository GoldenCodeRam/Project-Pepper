# Simple-Load-Balancer

<p align="center">
  <kbd>
    <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" width="120" height="60">
  </kbd>
  <kbd>
    <img src="https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg" width="120" height="60" style="padding-left: 500px; padding-bottom: 100px;">
  </kbd>
  <kbd>
    <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg" width="120" height="60">
  </kbd>
  <kbd>
    <img src="https://www.vectorlogo.zone/logos/sqlite/sqlite-ar21.svg" width="120" height="60">
  </kbd>
</p>
<p align="center">
  A load balancing middleware, made with NodeJs, ExpressJs, some SQLite and Typescript.
</p>

## Features

This middleware was created for the usage of this [**server 🤖**](https://github.com/HeizRaum/Simple-Image-Modifier) and this [**client 🧍**](). But the base functionality of the middleware is:

* **Server Monitoring**: To see if a list of servers, referenced by a Docker repository, are up and running or not, and store that information in log files.
* **Add and Restart Servers**: Along with the monitoring functionality, the middleware can add and start new instances of servers, and also restart a server if it has crashed or shut down.
* [**server 🤖**](https://github.com/HeizRaum/Simple-Image-Modifier) **Load Balancer**: Not purely base functionality, but the middleware should balance the load, with a very simple turn based load balancing, to serve information to the list of servers, and return the information to the client.

### 1. Server Monitoring

The middleware stores a reference to a Docker repository, on which the middleware will search for running instances of the repository image, and a Database folder path, on which the middleware will store the SQLite log files. As seen in the *Diagram 1*. The log files contain the status of the server at the request, and the hour of the request,

<p align="center">
  <img src="https://user-images.githubusercontent.com/46252493/104741975-e43d0280-5717-11eb-9d60-5cfe39474eb9.png">
</p>
<p align="center">
  Diagram 1: Basic server monitoring system used by the middleware.
</p>

From the reference to the Docker repository, the middleware takes a list of running servers, and from the Database folder path, the middleware takes a list of log files.
The middleware then takes the two lists of files and running servers, and it evaluates three types of situations, as can be seen in the *Diagram 2*:

* The SQLite file exists but it's server is not running.
* A server is running but it doesn't have an SQLite log file.
* Both the server and the SQLite log file exist and have a reference on each other.

On every situation, the middleware creates an object containing the server and the SQLite log file, if it doesn't exist, and starts the monitoring asynchronously. If there's an SQLite log file but not a running server, the middleware immediately supposes the server could be restarted, so it starts monitoring the server.

<p align="center">
  <img src="https://user-images.githubusercontent.com/46252493/104744966-81e60100-571b-11eb-90eb-4d8fc5a3fb26.png">
</p>
<p align="center">
  Diagram 2: Basic server monitoring system used by the middleware.
</p>

### 2. Add and Restart Servers

