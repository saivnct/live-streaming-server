const express = require('express');
const app = express();

app.use(express.urlencoded());

app.post("/auth", function (req, res) {
  /* This server is only available to nginx */
  const streamkey = req.body.key;

  console.log("on Publish");
  console.log("body: ", req.body)

  /* You can make a database of users instead :) */
  if (streamkey === "supersecret") {
    res.status(200).send();
    return;
  }

  /* Reject the stream */
  res.status(403).send();
});

app.post("/update", function (req, res) {
  /* This server is only available to nginx */
  const time = req.body.time;
  const timestamp = req.body.timestamp;

  console.log("on Update");
  console.log("body: ",  req.body);
  console.log("time: ", time);
  console.log("timestamp: ", timestamp)

  res.status(200).send();
  return;
});




app.listen(8000, function () {
  console.log("Listening on port 8000!");
});