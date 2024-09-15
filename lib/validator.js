import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";


const validateHandler = (req, res, next) => {
    const errors = validationResult(req);

    const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");

    if (errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages, 400));
}

const registerValidator = () => [

    body("email", "Please Enter Email").notEmpty(),
    body("password", "Please Enter password").notEmpty(),
    body("name", "Please Enter name").notEmpty(),
    body("email", "Please Enter role").notEmpty(),
    body("gender", "Please Enter Gender").notEmpty()

]

const loginValidator = () => [
    body("email", "Please Enter Email").notEmpty(),
    body("password", "Please Enter Password").notEmpty()
]

export {
    validateHandler,
    registerValidator,
    loginValidator
}