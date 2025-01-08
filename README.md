# Jiffy Chat Instant Messenger

An instant messenger application built using React, Node, Express, MongoDb and SocketIo. Users can start conversations with anybody in the database and create group chats with multiple users, sending and receiving text based messages in real time.

The stand out features of the application are user authentication, made using JSON web tokens (JWT), and the real time instant messenging made possible using socketIo.

[Deployed version here!](https://jiffymessenger.netlify.app/)

---

## Installation

clone the project

#### http

    https://github.com/Willfoss/instant-messenger.git

### SSH

    git@github.com:Willfoss/instant-messenger.git

run the following commands to install all packages

    npm i
    cd front-end
    npm i

---

## Version Requirements

node.js - v20.14.0

jsonwebtoken: v9.0.2

mongodb: v6.10.0

mongoose: v8.8.

socket.io: v4.8.1

---

## Further Improvements

currently only the messages themselves are in real time. Notifications do not yet exist in the back end and are only present during a login session in the front end. The next step involves adding notifications to the back end and having these render in real time using socketIo
