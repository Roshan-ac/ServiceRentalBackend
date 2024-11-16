"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// utils/prisma.ts
// import { PrismaClient } from "@prisma/client";
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=prisma.js.map