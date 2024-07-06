const joi = require("joi");

const validator = (validationSchema) => async (req, res, next) => {
    try {
      const result = await validationSchema.validate(req.body);
      if (result.error) {
        return res.status(400).json({
          status: "error",
          message: "Validation error",
          data: result.error
        })
      }
  
      next();
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Validation error",
        data: error,
      })
    }
  };
  
  const signupSchema = joi.object({
    firstName: joi.string().min(3).max(20).required(),
    lastName: joi.string().min(3).max(20).required(),
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    phone: joi.number().required(),
    password: joi.string().required(),
    books: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  });

  const loginSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: joi.string().required()
});
  
  const validateSignup = validator(signupSchema);
  const validateLogin = validator(loginSchema);
  
  module.exports = { validateSignup, validateLogin };