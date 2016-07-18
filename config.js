module.exports = {
    "port": process.env.SESSION_SECRET || 3030,
    "sessionCookie": {
        "maxAge": 8640000,
        "httpOnly": true,
        "secure": false
    },
    "sessionSecret": process.env.SESSION_SECRET || "TestTest",
    "sessionKey": 'sessionId',
    "sessionCollection": 'sessions'
};
