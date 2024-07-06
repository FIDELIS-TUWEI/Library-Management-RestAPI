const Joi = require("joi");

const validator = (validationSchema) => async (req, res, next) => {
    try {
        const result = await validationSchema.validate(req.body);
        if (result.error) {
            return res.status(400).json({
                status: "error",
                message: "Validation error",
                data: result.error.details
            });
        }
        next();
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Validation error",
            data: error
        });
    }
};

const borrowSchema = Joi.object({
    durationOfBorrow: Joi.string().required()
});

const validateBorrow = validator(borrowSchema);

module.exports = validateBorrow;
