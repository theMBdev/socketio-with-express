
async function ajax(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.addEventListener("load", function () {
            try {
                resolve(this.responseText);
            } catch (error) {
                reject(error);
            }
        });
        request.open("GET", url);
        request.send();
        request.addEventListener("error", reject)
    });
}

/** @returns {void} */
async function main() {
    // call sample API
    document.getElementById("random-number").innerText = await ajax("/random");

    const socket = io();
    socket.on("connect", () => socket.emit("hello", `Hi there! I am ${window.navigator.userAgent}`));

    const secondsElement = document.getElementById("seconds");
    socket.on("seconds", seconds => secondsElement.innerText = seconds.toString());

    const welcomeElement = document.getElementById("welcome");
    socket.on("online", online => onlineElement.innerText = online.toString());

    // same as above but onld syntax
    const onlineElement = document.getElementById("online");
    socket.on("welcome", welcomeMessage => welcomeElement.innerText = welcomeMessage);
    
    // socket.emit("welcome", `Welcome! You are visitor number ${nextVisitorNumber++}`);

    const outputElement = document.getElementById("output");
    socket.on("onlineCLients", onlineClentsOutput => outputElement.innerText = JSON.stringify(onlineClentsOutput));





    // Messaging
    var messages = document.getElementById('messages');
      var form = document.getElementById('form');
      var input = document.getElementById('input');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

      socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });



}

main();


