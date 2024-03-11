const StreamHandler = require('./../local/stream-handler');

exports.player = function (req, res) {
    const name = req.query.name;
    console.log("player",name);

    const gStream = StreamHandler.getStream(name);
    if (!gStream) {
        return res.status(403).json({
            status: 403,
            message: 'Invalid gStream'
        });

    }


    res.status(200)
        .render('media', {
            streamName: 'TEST',
            streamUrl: `http://localhost:8080/hls/${gStream.name}.m3u8`,
        });
}
