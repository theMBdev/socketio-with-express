
const { Console } = require("console");
const
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io");

const SERVER_PORT = 3000;

let nextVisitorNumber = 1;
let onlineClients = new Set();

function generateRandomNumber() {
    return (Math.floor(Math.random() * 1000)).toString();
}

function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);
    console.log("oc", onlineClients);
    onlineClients.add(socket.id);

    // console.log("OnlineClients", onlineClients);

    socket.on("disconnect", () => {
        onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    });

    // echoes on the terminal every "hello" message this socket sends
    socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}"`));

    // will send a message only to this socket (different than using `io.emit()`, which would broadcast it)
    socket.emit("welcome", `Welcome! You are visitor number ${nextVisitorNumber++}`);

   

   





}

function startServer() {
    console.log("starting server")

    // create a new express app
    const app = express();
    // create http server and wrap the express app
    const server = http.createServer(app);
    // bind socket.io to that server
    const io = socketio(server);

    // example on how to serve a simple API
    app.get("/random", (req, res) => res.send(generateRandomNumber()));

    // example on how to serve static files from a given folder
    app.use(express.static("public"));

    // will fire for every new websocket connection
    io.on("connection", onNewWebsocketConnection);

    // important! must listen from `server`, not `app`, otherwise socket.io won't function correctly
    // server.listen(process.env.PORT, () => console.info(`Listening on port ${process.env.PORT}.`));
    server.listen(SERVER_PORT, () => console.info(`Listening on port ${SERVER_PORT}.`));
    console.log("server started")

    // will send one message per second to all its clients
    let secondsSinceServerStarted = 0;
    setInterval(() => {
        secondsSinceServerStarted++;
        io.emit("seconds", secondsSinceServerStarted);
        io.emit("online", onlineClients.size);

         // turn set object into val readable
    var item;
    var onlineClientsAsObject = ''
    for (item of onlineClients.values())
    onlineClientsAsObject+=item + ' '; 

        io.emit("onlineCLients", onlineClientsAsObject)
    }, 1000);


    io.on('connection', (socket) => {
        socket.on('chat message', msg => {
          io.emit('chat message', msg);
        });
      });



}

startServer();

