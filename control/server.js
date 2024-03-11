const path = require('path'); // a node built-in to manipulate path name
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//using template engine to render view to client
//express template engines:Pug, EJS, Handlebars
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));  //create a path by joining the dir name with '/views'
app.use(express.static(path.join(__dirname, 'public')));


const RtmpRoutes = require('./router/rtmp');
const ClientRoutes = require('./router/client');
const StreamRoutes = require('./router/stream');
app.use('/rtmp', RtmpRoutes);
app.use('/client', ClientRoutes);
app.use('/stream', StreamRoutes);


app.listen(8000, function () {
  console.log("Listening on port 8000!");
});