"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv").config();
const port = process.env.PORT || 9000;
app_1.default.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server Rental Running : http://localhost:${port}`);
    /* eslint-enable no-console */
});
//# sourceMappingURL=server.js.map