const Joi = require("joi");

const updateConfPolicySchema = Joi.object({
    startAt: Joi.number().min(0),
    endAt: Joi.number().min(0),
});

module.exports = updateConfPolicySchema;