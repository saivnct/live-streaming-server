const StreamHandler = require('./../local/stream-handler');

exports.checkName = function (req, res, next, val) {

    const gStream = StreamHandler.getStream(val);

    if (!gStream) {
        return res.status(403).json({
            status: 403,
            message: 'Invalid gStream'
        });

    }

    req.gStream = gStream;
    next();
}




exports.getAll = function (req, res) {

    const items = StreamHandler.getAll();

    res.status(200).json({
        status: 200,
        message: 'OK',
        items
    });
}


exports.deleteMany = function (req, res) {
    const form = req.form;
    const names = form.names;
    StreamHandler.deleteMany(names);

    res.status(200).json({
        status: 200,
        message: 'OK',
    });
}

exports.create = function (req, res) {
    try{
        const form = req.form;
        const gStream = StreamHandler.createStream(form.name, form.startAt, form.endAt);
        res.status(200).json({
            status: 200,
            message: 'OK',
            gStream
        });
    }catch (error){
        return res.status(403).json({
            status: 403,
            message: error.toString()
        });
    }
}


exports.get = function (req, res) {
    const gStream = req.gStream;

    res.status(200).json({
        status: 200,
        message: 'OK',
        gStream
    });
}



exports.delete = function (req, res) {
    const gStream = req.gStream;
    StreamHandler.deleteStream(gStream.name);

    res.status(200).json({
        status: 200,
        message: 'OK',
    });
}


exports.update = function (req, res) {
    const form = req.form;

    let gStream = req.gStream;
    gStream = StreamHandler.updateStream(gStream.name, form.startAt, form.endAt);

    res.status(200).json({
        status: 200,
        message: 'OK',
        gStream
    });
}



