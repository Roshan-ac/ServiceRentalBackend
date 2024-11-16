"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeMe = void 0;
const jwt_1 = require("@src/utils/jwt");
const authorizeMe = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Authorization token missing or invalid" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded; // Attach the decoded token to the request
        next(); // Proceed to the next middleware or handler
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authorizeMe = authorizeMe;
//# sourceMappingURL=authorize.js.map