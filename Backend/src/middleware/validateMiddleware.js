import { validationResult } from "express-validator";
import { sendError } from "../utils/responseHelper.js";

const validateMiddleware = (req, res, next) => {
    const errors = validationResult(req); // yesle chai express-validator le validate gareko errors haru lai capture garxa

    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return sendError(res, firstError.msg, 400);
    }
    next();
};

export default validateMiddleware;