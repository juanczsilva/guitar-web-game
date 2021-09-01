const sock = io();

sock.on("msg", (text) => {
    console.log(text);
    document.getElementById("test").innerHTML = text;
});
