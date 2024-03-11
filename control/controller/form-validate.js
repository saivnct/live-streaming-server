exports.validate = (formSchema) => {
    return async (req, res, next) => {
        try {
            if (formSchema){
                const validationResult = formSchema.validate(req.body);
                if (validationResult.error) {
                    throw new Error(`Invalid Form - ${validationResult.error.message}`);
                }

                req.form = validationResult.value;
            }
            next();
        }catch (error) {
            next(error);
        }
    }
}