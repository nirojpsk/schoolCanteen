const errorMiddleware = (err, req, res, next) => {

// If the response status code is not set or is 200, set it to 500 (Internal Server Error)
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types

    //yedi cast error aayo vane, tyo invalid resource ID ho vanne message set garne [cast error vaneko mongoose ko error ho, jaba invalid ID pass garincha vane aaucha]
    if (err.name === "castError") {
        message = "Invalid resource ID";
    }

    // yedi duplicate key error aayo vane, tyo duplicate field already exists vanne message set garne [duplicate key error vaneko mongoose ko error ho, jaba unique field ma duplicate value pass garincha vane aaucha] e.g. email field ma duplicate email pass garincha vane aaucha
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue || {})[0];
        message = `${duplicateField} already exists.`
    }

    // yedi validation error aayo vane, tyo validation error ko message haru lai comma separated string ma join garne [validation error vaneko mongoose ko error ho, jaba validation rules violate garincha vane aaucha] e.g. email field ma invalid email pass garincha vane aaucha
    if (err.name === "validationError") {
        const messages = Object.values(err.erros).map((val) => val.message);
        message = messages.join(', ');
    }
    //yesle response ma error message, stack trace (development environment ma matra) ra success false return garne
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorMiddleware;