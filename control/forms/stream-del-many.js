const Joi = require("joi");

const namesSchema = Joi.object({
    names: Joi.array().items(Joi.string()).required(),
});

module.exports = namesSchema;