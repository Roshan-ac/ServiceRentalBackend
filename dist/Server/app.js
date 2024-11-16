"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("../Middleware/errorHandler");
const Auth_1 = __importDefault(require("../Routes/Auth"));
const me_1 = __importDefault(require("../Routes/me"));
const path_1 = __importDefault(require("path"));
const posts_1 = __importDefault(require("../Routes/posts"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// app.use(compression());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static(path_1.default.resolve("./public"), {
    setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
}));
// Routes
// app.use("/", (req, res) => {
//   res.send("Service Rental API");
// });
app.use("/api/auth", Auth_1.default);
app.use("/api/me", me_1.default);
app.use("/api/post", posts_1.default);
// Error handling (ensure this is after all other middleware and routes)
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map