/**
 * @module gstream
 */


/**
 * @typedef module:gstream.Stream
 * @type {object}
 * @property {string} name
 * @property {string} key
 * @property {number} state
 * @property {number | undefined | null} startAt
 * @property {number | undefined | null} endAt
 */
const { v4: uuidv4 } = require('uuid');
const config = require('./../utils/config');

class StreamHandler{
    constructor() {
        /**
         * @type {Map<string, module:gstream.Stream>}
         */
        this.streamMap = new Map();
    }


    /**
     *
     * @param {string} name
     * @param {number | undefined | null} startAt
     * @param {number | undefined | null} endAt
     * @returns module:gstream.Stream
     */
    createStream(name, startAt = null, endAt = null){
        let stream = this.getStream(name);
        if (stream){
            throw new Error("Stream already exists");
        }

        let key = uuidv4().toString();
        stream = {
            name,
            key,
            state: config.StreamState.INACTIVE,
        };

        if (startAt){
            stream.startAt = startAt;
        }
        if (endAt){
            stream.endAt = endAt;
        }

        this.streamMap.set(name, stream);
        return stream;
    }

    /**
     *
     * @param {string} name
     * @returns module:gstream.Stream
     */
    getStream(name){
        return this.streamMap.get(name);
    }


    /**
     *
     * @returns module:gstream.Stream[]
     */
    getAll(){
        return Array.from(this.streamMap.values());
    }


    /**
     *
     * @param {string} name
     * @param {number | undefined | null} startAt
     * @param {number | undefined | null} endAt
     * @returns module:gstream.Stream
     */
    updateStream(name, startAt = null, endAt = null){
        let stream = this.getStream(name);
        if (!stream){
            throw new Error("Stream not found");
        }
        if (!isNaN(startAt)){
            stream.startAt = startAt;
        }
        if (!isNaN(endAt)){
            stream.endAt = endAt;
        }
        return stream;
    }

    /**
     *
     * @param {string} name
     * @param {number} state
     * @returns module:gstream.Stream
     */
    updateStreamState(name, state){
        let stream = this.getStream(name);
        if (!stream){
            throw new Error("Stream not found");
        }

        if (state !== config.StreamState.ACTIVE && state !== config.StreamState.INACTIVE){
            throw new Error("Invalid state");
        }

        stream.state = state;
        return stream;
    }


    /**
     *
     * @param {string} name
     * @returns void
     */
    deleteStream(name){
        this.streamMap.delete(name);
    }

    deleteAll(){
        this.streamMap.clear();
    }


    /**
     *
     * @param {string[]} names
     * @returns void
     */
    deleteMany(names){
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            this.deleteStream(name);
        }
    }



}

module.exports = new StreamHandler();