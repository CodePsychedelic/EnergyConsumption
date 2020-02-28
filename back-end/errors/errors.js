
exports.BAD_REQUEST = {
    status: 400,
    message: "Bad request"
};

exports.NOT_AUTHORIZED = {
    status: 401,
    message: "Not authorized"
};

exports.NO_QUOTA = {
    status: 402,
    message: "Out of quota"
};

exports.NO_DATA = {
    status: 403,
    message: "No data"
};

// my errors
exports.USER_NOT_FOUND = {
    status: 404,
    message: "User not found"
};
exports.USER_EXISTS = {
    status: 405,
    message: "User exists"
};
