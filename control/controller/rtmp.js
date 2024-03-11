const moment = require('moment');
const StreamHandler = require('./../local/stream-handler');
const config = require("../utils/config");

exports.publish = function (req, res) {
    /* This server is only available to nginx */


    const streamkey = req.body.key;
    const name = req.body.name;

    console.log("on Publish");
    // console.log("body: ", req.body);
    console.log("streamkey: ", streamkey);
    console.log("name: ", name);

    /**
     * @type {module:gstream.Stream}
     */
    const gStream = StreamHandler.getStream(name);
    if (!gStream) {
        console.error("Stream not found");
        /* Reject the stream */
        return res.status(403).send();
    }

    if (gStream.key !== streamkey) {
        console.error("Invalid Stream key");
        /* Reject the stream */
        return res.status(403).send();
    }

    const now =  moment().utc().valueOf();
    if (gStream.startAt && now < gStream.startAt){
        console.error("Not time to Stream");
        /* Reject the stream */
        return res.status(403).send();
    }

    if (gStream.endAt && now > gStream.endAt){
        console.error("Stream time has ended");
        /* Reject the stream */
        return res.status(403).send();
    }

    StreamHandler.updateStreamState(name, config.StreamState.ACTIVE);

    res.status(200).send();
};

exports.publishdone = function (req, res) {
    /* This server is only available to nginx */
    const streamkey = req.body.key;
    const name = req.body.name;


    console.log("on PublishDone");
    // console.log("body: ", req.body);
    console.log("streamkey: ", streamkey);
    console.log("name: ", name);


    /**
     * @type {module:gstream.Stream}
     */
    const gStream = StreamHandler.getStream(name);

    if (!gStream) {
        /* Reject the stream */
        return res.status(200).send();
    }

    StreamHandler.updateStreamState(name, config.StreamState.INACTIVE);

    res.status(200).send();
};

exports.update = function (req, res) {
    /* This server is only available to nginx */
    // const time = req.body.time;
    // const timestamp = req.body.timestamp;
    const streamkey = req.body.key;
    const name = req.body.name;

    // console.log("on Update");
    // console.log("body: ",  req.body);

    /**
     * @type {module:gstream.Stream}
     */
    const gStream = StreamHandler.getStream(name);
    if (!gStream) {
        /* Reject the stream */
        return res.status(403).send();
    }

    const now =  moment().utc().valueOf();
    if (gStream.startAt && now < gStream.startAt){
        /* Reject the stream */
        return res.status(403).send();
    }

    if (gStream.endAt && now > gStream.endAt){
        /* Reject the stream */
        return res.status(403).send();
    }

    res.status(200).send();
};

exports.play =  function (req, res) {
    /* This server is only available to nginx */
    // console.log("on play");
    // console.log("body: ",  req.body);

    //TODO - maybe implement some kind of auth here

    res.status(200).send();
};