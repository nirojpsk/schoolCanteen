const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Unauthorized: No user information found');
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Access Denied. Allowed Roles: ${allowedRoles.join(', ')}`);
        };
        next();
    };
};

export default authorizeRoles;