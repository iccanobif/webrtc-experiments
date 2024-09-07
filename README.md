# webrtc demo

This project implements WebRTC video streams so that there's one user streaming their webcam using their browser and one or more listeners watching the stream.
A node.js server serves the static assets and uses web sockets for communications with the clients.
Another node.js server is used to relay the video stream from the broadcaster to the listeners.
