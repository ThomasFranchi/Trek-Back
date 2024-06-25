const http = require("http");
const app = require("./app");

const httpServer = http.createServer(app);

// Set port and start server listening
const port = process.env.PORT_BACK;
httpServer.listen(port);

//display in console the listened Port and the url of the / page.
httpServer.addListener('listening', () =>{
    console.log(`start listening on port ${port}...`);
    console.log(`App : http://localhost:${port}`);
})

//display in console the REQ METHOD and the URL
httpServer.addListener("request", (req) => {
    console.log(`${req.method} ${req.url}`);
  });