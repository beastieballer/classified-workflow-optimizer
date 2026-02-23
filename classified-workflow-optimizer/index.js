const http = require('http');
const port = process.env.PORT || 3000;

const requestHandler = (request, response) => {
  response.end('Hello! The Classified Workflow Optimizer MVP is running.');
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('Failed to start server:', err);
  }
  console.log(`Server is listening on port ${port}`);
});
