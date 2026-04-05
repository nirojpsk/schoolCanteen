export const sendSuccess = (
    res,
    message = "Request successful",
    data = null,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (
    res,
    message = "An error occurred",
    statusCode = 500
) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};