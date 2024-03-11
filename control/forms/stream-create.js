const Joi = require("joi");

const createConfPolicySchema = Joi.object({
    name: Joi.string().required(),
    startAt: Joi.number().min(0),
    endAt: Joi.number().min(0),
});

module.exports = createConfPolicySchema;