const express = require('express');
const streamController = require('./../controller/stream');
const formValidate = require('./../controller/form-validate');

const router = express.Router();

const NamesSchema = require("../forms/stream-del-many");
const CreateStreamSchema = require("../forms/stream-create");
const UpdateStreamSchema = require("../forms/stream-update");


router.param('name', streamController.checkName);

router.route('/')
    .get(streamController.getAll)
    .delete(formValidate.validate(NamesSchema), streamController.deleteMany)
    .post(formValidate.validate(CreateStreamSchema), streamController.create);

router
    .route('/:name')
    .get(streamController.get)
    .delete(streamController.delete)
    .patch(formValidate.validate(UpdateStreamSchema), streamController.update);

module.exports = router;