/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Controller/Auth/index.ts":
/*!**************************************!*\
  !*** ./src/Controller/Auth/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.register = void 0;\nconst zod_1 = __webpack_require__(/*! zod */ \"zod\");\nconst ApiError_1 = __webpack_require__(/*! ../../utils/ApiError */ \"./src/utils/ApiError.ts\");\nconst prisma_1 = __webpack_require__(/*! @src/utils/prisma */ \"./src/utils/prisma.ts\");\nconst jwt_1 = __webpack_require__(/*! @src/utils/jwt */ \"./src/utils/jwt.ts\");\nconst UserRole = zod_1.z.enum([\"Freelancer\", \"Customer\"], {\n    errorMap: () => ({\n        message: \"Role must be either 'Freelancer' or 'Customer'\",\n    }),\n});\nconst registerSchema = zod_1.z.object({\n    email: zod_1.z\n        .string({\n        required_error: \"Email is required\",\n    })\n        .refine((email) => {\n        const validDomains = [\n            \"gmail.com\",\n            \"yahoo.com\",\n            \"hotmail.com\",\n            \"outlook.com\",\n        ];\n        const domain = email.split(\"@\")[1];\n        return validDomains.includes(domain);\n    }, \"Email domain not allowed. Use gmail.com, yahoo.com, hotmail.com, or outlook.com\"),\n    firstName: zod_1.z\n        .string({\n        required_error: \"First name is required\",\n    })\n        .min(1, \"First name cannot be empty\")\n        .max(10, \"First name cannot exceed 10 characters\")\n        .trim(),\n    lastName: zod_1.z\n        .string({\n        required_error: \"Last name is required\",\n    })\n        .min(1, \"Last name cannot be empty\")\n        .max(10, \"Last name cannot exceed 10 characters\")\n        .trim(),\n    middleName: zod_1.z\n        .string()\n        .max(10, \"Middle name cannot exceed 10 characters\")\n        .trim()\n        .optional(),\n    userName: zod_1.z\n        .string({\n        required_error: \"UserName is required\",\n    })\n        .min(1, \"UserName cannot be empty\")\n        .max(10, \"UserName cannot exceed 10 characters\")\n        .trim(),\n    role: UserRole,\n});\nconst register = async (req, res) => {\n    const validatedData = registerSchema.parse(req.body);\n    // Check if email exists\n    const existingEmail = (await prisma_1.prisma.customer.findUnique({\n        where: { email: validatedData.email },\n    })) ||\n        (await prisma_1.prisma.freelancer.findUnique({\n            where: { email: validatedData.email },\n        }));\n    if (existingEmail) {\n        throw new ApiError_1.ApiError(400, \"Email already exists\");\n    }\n    // Check if username exists\n    const existingUsername = (await prisma_1.prisma.customer.findUnique({\n        where: { username: validatedData.userName },\n    })) ||\n        (await prisma_1.prisma.freelancer.findUnique({\n            where: { username: validatedData.userName },\n        }));\n    if (existingUsername) {\n        throw new ApiError_1.ApiError(400, \"Username already exists\");\n    }\n    try {\n        if (validatedData.role === \"Customer\") {\n            const customer = await prisma_1.prisma.customer.create({\n                data: {\n                    email: validatedData.email,\n                    firstName: validatedData.firstName,\n                    lastName: validatedData.lastName,\n                    middleName: validatedData.middleName,\n                    username: validatedData.userName,\n                },\n            });\n            const token = (0, jwt_1.generateToken)({\n                email: customer.email,\n                id: customer.id,\n                role: \"Customer\",\n            });\n            const updateSession = await prisma_1.prisma.session.create({\n                data: {\n                    customerId: customer.id,\n                    token,\n                    expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),\n                },\n                select: {\n                    token: true,\n                    expireDate: true,\n                },\n            });\n            return res.status(201).json({\n                success: true,\n                message: \"Customer registered successfully\",\n                data: { ...customer, updateSession },\n            });\n        }\n        const freelancer = await prisma_1.prisma.freelancer.create({\n            data: {\n                email: validatedData.email,\n                firstName: validatedData.firstName,\n                lastName: validatedData.lastName,\n                middleName: validatedData.middleName,\n                username: validatedData.userName,\n            },\n        });\n        const token = (0, jwt_1.generateToken)({\n            email: freelancer.email,\n            id: freelancer.id,\n            role: \"Freelancer\",\n        });\n        const updateSession = await prisma_1.prisma.session.create({\n            data: {\n                freelancerId: freelancer.id,\n                token,\n                expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),\n            },\n            select: {\n                token: true,\n                expireDate: true,\n            },\n        });\n        return res.status(201).json({\n            success: true,\n            message: \"Freelancer registered successfully\",\n            data: { ...freelancer, updateSession },\n        });\n    }\n    catch (error) {\n        throw new ApiError_1.ApiError(500, \"Error creating user\", [error]);\n    }\n};\nexports.register = register;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Controller/Auth/index.ts?");

/***/ }),

/***/ "./src/Controller/Otp/index.ts":
/*!*************************************!*\
  !*** ./src/Controller/Otp/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n// Utility function to generate unique session ID\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.otpLimiter = exports.verifyOTPController = exports.sendOTPController = void 0;\nconst emailOtpMailer_1 = __webpack_require__(/*! @src/utils/emailOtpMailer */ \"./src/utils/emailOtpMailer.ts\");\nconst crypto_1 = __importDefault(__webpack_require__(/*! crypto */ \"crypto\"));\nconst express_rate_limit_1 = __importDefault(__webpack_require__(/*! express-rate-limit */ \"express-rate-limit\"));\nconst zod_1 = __webpack_require__(/*! zod */ \"zod\");\nconst ApiError_1 = __webpack_require__(/*! @src/utils/ApiError */ \"./src/utils/ApiError.ts\");\nconst jwt_1 = __webpack_require__(/*! @src/utils/jwt */ \"./src/utils/jwt.ts\");\nconst asyncHandler_1 = __webpack_require__(/*! @src/Middleware/asyncHandler */ \"./src/Middleware/asyncHandler.ts\");\nconst prisma_1 = __webpack_require__(/*! @src/utils/prisma */ \"./src/utils/prisma.ts\");\n// Utility function to generate unique session ID\nconst generateSessionId = () => {\n    return crypto_1.default.randomBytes(32).toString(\"hex\");\n};\n// Improved OTP schema with email validation\nconst OtpSchema = zod_1.z.object({\n    email: zod_1.z\n        .string({\n        required_error: \"Email is required\",\n    })\n        .refine((email) => {\n        const validDomains = [\n            \"gmail.com\",\n            \"yahoo.com\",\n            \"hotmail.com\",\n            \"outlook.com\",\n        ];\n        const domain = email.split(\"@\")[1];\n        return validDomains.includes(domain);\n    }, \"Email domain not allowed. Use gmail.com, yahoo.com, hotmail.com, or outlook.com\"),\n});\n// Improved OTP verification schema\nconst VerifyOtpSchema = zod_1.z.object({\n    email: zod_1.z.string().email(\"Invalid email format\"),\n    otp: zod_1.z\n        .string()\n        .length(4, \"OTP must be exactly 6 digits\")\n        .regex(/^\\d{4}$/, \"OTP must contain only digits\"),\n    sessionId: zod_1.z.string().min(1, \"Session ID is required\"),\n});\nconst generateOTP = () => {\n    const min = 1000;\n    const max = 9999;\n    const otp = Math.floor(Math.random() * (max - min + 1)) + min;\n    console.log(\"Generated OTP:\", otp);\n    return otp.toString();\n};\n// Cleanup function for expired/used OTPs\nconst cleanupOTPs = async () => {\n    try {\n        await prisma_1.prisma.otp.deleteMany({\n            where: {\n                expiresAt: { lte: new Date() },\n            },\n        });\n    }\n    catch (error) {\n        throw new ApiError_1.ApiError(500, \"Failed to clean up expired OTPs\");\n    }\n};\n// Send OTP controller\nconst sendOTPController = async (req, res, next) => {\n    const validatedData = OtpSchema.parse(req.body);\n    // Generate new OTP and session ID\n    const otp = generateOTP();\n    const sessionId = generateSessionId();\n    // Calculate expiry (10 minutes from now)\n    const expiresAt = new Date();\n    expiresAt.setMinutes(expiresAt.getMinutes() + 10);\n    // Create new OTP record with session ID\n    await prisma_1.prisma.otp.create({\n        data: {\n            email: validatedData.email,\n            otp,\n            sessionId,\n            expiresAt,\n        },\n    });\n    try {\n        // Delete any existing unused OTPs for this email\n        await prisma_1.prisma.otp.deleteMany({\n            where: {\n                email: validatedData.email,\n            },\n        });\n        // Generate new OTP and session ID\n        const otp = generateOTP();\n        const sessionId = generateSessionId();\n        console.log(\"otp\", otp, sessionId);\n        // Calculate expiry (10 minutes from now)\n        const expiresAt = new Date();\n        expiresAt.setMinutes(expiresAt.getMinutes() + 10);\n        // Create new OTP record with session ID\n        await prisma_1.prisma.otp.create({\n            data: {\n                email: validatedData.email,\n                otp,\n                sessionId,\n                expiresAt,\n            },\n        });\n        // Send email with OTP\n        await (0, emailOtpMailer_1.EmailVerification)(validatedData.email, Number(otp));\n        // Return only the session ID to the client\n        res.status(200).json({\n            success: true,\n            sessionId,\n            message: \"OTP sent successfully\",\n        });\n    }\n    catch (error) {\n        throw new ApiError_1.ApiError(500, \"Failed to send OTP\");\n    }\n};\nexports.sendOTPController = sendOTPController;\nconst createSession = async (userId, email, role) => {\n    const token = (0, jwt_1.generateToken)({ id: userId, email, role });\n    const sessionData = {\n        token,\n        expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day\n    };\n    const isSessionExist = await prisma_1.prisma.session.findFirst({\n        where: {\n            ...(role === \"Customer\"\n                ? { customerId: userId }\n                : { freelancerId: userId }),\n        },\n    });\n    if (!isSessionExist) {\n        return await prisma_1.prisma.session.create({\n            data: {\n                ...(role === \"Customer\"\n                    ? { customerId: userId }\n                    : { freelancerId: userId }),\n                ...sessionData,\n            },\n            select: {\n                token: true,\n                expireDate: true,\n            },\n        });\n    }\n    return await prisma_1.prisma.session.update({\n        data: sessionData,\n        where: {\n            ...(role === \"Customer\"\n                ? { customerId: userId }\n                : { freelancerId: userId }),\n        },\n        select: {\n            token: true,\n            expireDate: true,\n        },\n    });\n};\nconst findUser = async (email) => {\n    const customer = await prisma_1.prisma.customer.findFirst({\n        where: { email },\n        select: {\n            id: true,\n            firstName: true,\n            lastName: true,\n            username: true,\n            email: true,\n            middleName: true,\n            session: true,\n        },\n    });\n    if (customer) {\n        return { user: customer, role: \"Customer\" };\n    }\n    const freelancer = await prisma_1.prisma.freelancer.findFirst({\n        where: { email },\n        select: {\n            id: true,\n            firstName: true,\n            username: true,\n            lastName: true,\n            email: true,\n            middleName: true,\n            session: true,\n        },\n    });\n    if (freelancer) {\n        return { user: freelancer, role: \"Freelancer\" };\n    }\n    return null;\n};\nexports.verifyOTPController = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {\n    const { email, otp, sessionId } = req.body;\n    const validatedData = VerifyOtpSchema.parse({ email, otp, sessionId });\n    // Validate required fields\n    if (!email || !otp || !sessionId) {\n        throw new ApiError_1.ApiError(400, \"Email, OTP, and session ID are required\");\n    }\n    // Validate email format\n    const isEmailValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n    if (!isEmailValid) {\n        throw new ApiError_1.ApiError(400, \"Invalid email address\");\n    }\n    try {\n        // Verify OTP\n        console.log(\"validatedData\", validatedData);\n        const otpRecord = await prisma_1.prisma.otp.findFirst({\n            where: {\n                email: validatedData.email,\n                otp: validatedData.otp,\n                sessionId: validatedData.sessionId,\n                expiresAt: { gt: new Date() },\n            },\n        });\n        if (!otpRecord) {\n            throw new ApiError_1.ApiError(400, \"Invalid or expired OTP\");\n        }\n        // Clean up expired OTPs\n        await cleanupOTPs();\n        // Find existing user\n        const userInfo = await findUser(email);\n        if (!userInfo) {\n            return res.status(200).json({\n                success: true,\n                isRegistered: false,\n                message: \"OTP verified successfully\",\n            });\n        }\n        await createSession(userInfo.user.id, email, userInfo.role);\n        return res.status(200).json({\n            success: true,\n            isRegistered: true,\n            ...(await findUser(email)),\n            message: \"OTP verified successfully\",\n        });\n    }\n    catch (error) {\n        console.log(\"error\", error);\n        if (error instanceof ApiError_1.ApiError) {\n            throw error;\n        }\n        throw new ApiError_1.ApiError(500, \"Failed to verify OTP\");\n    }\n});\n// Rate limiter middleware\nexports.otpLimiter = (0, express_rate_limit_1.default)({\n    windowMs: 10 * 60 * 1000, // 10 minutes\n    max: 5, // 5 requests per window per IP\n    message: \"Too many OTP requests. Please try again later.\",\n});\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Controller/Otp/index.ts?");

/***/ }),

/***/ "./src/Controller/me/index.ts":
/*!************************************!*\
  !*** ./src/Controller/me/index.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.meController = void 0;\nconst prisma_1 = __webpack_require__(/*! @src/utils/prisma */ \"./src/utils/prisma.ts\");\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\nclass MeController {\n    async editProfile(req, res) {\n        try {\n            const { firstName, lastName, middleName } = req.body;\n            if (!req.user?.email) {\n                return res.status(404).json({ message: \"User not found\" });\n            }\n            const model = req.user.role === \"Customer\" ? prisma_1.prisma.customer : prisma_1.prisma.freelancer;\n            const user = await model.findFirst({\n                where: { email: req.user.email },\n            });\n            if (!user) {\n                return res.status(404).json({ message: \"User not found\" });\n            }\n            let updatedData = { firstName, lastName, middleName };\n            let avatar;\n            // Handle avatar upload\n            if (req.files?.avatar && req.files.avatar[0]) {\n                const avatarPath = `/${req.files.avatar[0].originalname}`;\n                const filePath = path_1.default.join(\"public\", avatarPath);\n                // Ensure the directory exists\n                const directory = path_1.default.dirname(filePath);\n                if (!fs_1.default.existsSync(directory)) {\n                    fs_1.default.mkdirSync(directory, { recursive: true });\n                }\n                // Save the file\n                fs_1.default.writeFileSync(filePath, req.files.avatar[0].buffer);\n                avatar = {\n                    Avatar: {\n                        create: {\n                            image: filePath,\n                        },\n                    },\n                };\n            }\n            const updatedUser = await model.update({\n                where: { email: req.user.email },\n                data: { ...updatedData, ...avatar },\n            });\n            return res.status(200).json(updatedUser);\n        }\n        catch (error) {\n            console.error(\"Error updating profile:\", error);\n            return res.status(500).json({ message: \"Internal Server Error\" });\n        }\n    }\n    async getProfile(req, res) {\n        try {\n            if (!req.user?.email) {\n                return res.status(404).json({ message: \"User not found\" });\n            }\n            const model = req.user.role === \"Customer\" ? prisma_1.prisma.customer : prisma_1.prisma.freelancer;\n            const user = await model.findFirst({\n                where: { email: req.user.email },\n                include: { Avatar: {\n                        select: {\n                            image: true\n                        }\n                    } },\n            });\n            if (!user) {\n                return res.status(404).json({ message: \"User not found\" });\n            }\n            return res.status(200).json({\n                success: true,\n                data: user,\n            });\n        }\n        catch (error) {\n            console.error(\"Error getting profile:\", error);\n            return res.status(500).json({ message: \"Internal Server Error\" });\n        }\n    }\n}\nexports.meController = new MeController();\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Controller/me/index.ts?");

/***/ }),

/***/ "./src/Controller/post/index.ts":
/*!**************************************!*\
  !*** ./src/Controller/post/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.postController = void 0;\nconst prisma_1 = __webpack_require__(/*! @src/utils/prisma */ \"./src/utils/prisma.ts\");\nconst zod_1 = __webpack_require__(/*! zod */ \"zod\");\nconst postSchemma = zod_1.z.object({\n    caption: zod_1.z\n        .string()\n        .min(1, \"Caption is required\")\n        .regex(/^[a-zA-Z\\s]*$/, \"Location must be Valid\"),\n    location: zod_1.z\n        .string()\n        .min(1, \"Location is required\")\n        .regex(/^[a-zA-Z\\s]*$/, \"Location must be Valid\"),\n    estimatedTime: zod_1.z.string().min(1, { message: \"Time must be greater than 0.\" }),\n    paymentMethod: zod_1.z.enum([\"DAILY\", \"FIXED\"]),\n    dailyRate: zod_1.z\n        .number()\n        .optional()\n        .refine((val) => !val || val > 0, {\n        message: \"Daily rate must be a positive number.\",\n    }),\n    timeUnit: zod_1.z.enum([\"HOUR\", \"DAY\", \"WEEK\", \"MONTH\"]),\n    fixedRate: zod_1.z\n        .number()\n        .optional()\n        .refine((val) => !val || val > 0, {\n        message: \"Fixed rate must be a positive number.\",\n    }),\n    skills: zod_1.z\n        .array(zod_1.z.string())\n        .min(1, { message: \"Please enter at least one skill.\" }),\n    description: zod_1.z\n        .string()\n        .max(250, \"Description must be 250 characters or less\"),\n});\nclass PostController {\n    async addNewPost(req, res) {\n        console.log(await req.body);\n        console.log(\"hello world\");\n        if (typeof req.body === \"string\") {\n            req.body = JSON.parse(req.body);\n        }\n        const validatedData = postSchemma.parse(req.body);\n        const { caption, location, estimatedTime, timeUnit, dailyRate, fixedRate, skills, paymentMethod, description, } = validatedData;\n        const role = req.user?.role;\n        if (!role || role !== \"Customer\") {\n            return res.status(401).json({ message: \"Unauthorized\" });\n        }\n        // console.log(\"userId\", req.user);\n        // Save the post to the database\n        const post = await prisma_1.prisma.post.create({\n            data: {\n                caption,\n                location,\n                estimatedTime: parseInt(estimatedTime),\n                timeUnit: timeUnit,\n                paymentMode: paymentMethod,\n                ...(dailyRate && { dailyRate: dailyRate }),\n                ...(fixedRate && { fixedRate: fixedRate }),\n                requiredSkills: skills,\n                customerId: req.user?.id ?? \"\",\n                description,\n            },\n        });\n        return res.status(201).json({ message: \"Post created successfully\", post });\n    }\n    async getMyPosts(req, res) {\n        const role = req.user?.role;\n        if (!role || role !== \"Customer\") {\n            return res.status(401).json({ message: \"Unauthorized\" });\n        }\n        const posts = await prisma_1.prisma.post.findMany({\n            where: { customerId: req.user?.id },\n            orderBy: {\n                postedAt: \"desc\",\n            },\n            select: {\n                caption: true,\n                location: true,\n                estimatedTime: true,\n                paymentMode: true,\n                dailyRate: true,\n                fixedRate: true,\n                postedAt: true,\n                requiredSkills: true,\n                description: true,\n            },\n        });\n        return res.status(200).json({ posts });\n    }\n}\nexports.postController = new PostController();\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Controller/post/index.ts?");

/***/ }),

/***/ "./src/Middleware/asyncHandler.ts":
/*!****************************************!*\
  !*** ./src/Middleware/asyncHandler.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.asyncHandler = void 0;\nconst asyncHandler = (fn) => (req, res, next) => {\n    Promise.resolve(fn(req, res, next)).catch(next);\n};\nexports.asyncHandler = asyncHandler;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Middleware/asyncHandler.ts?");

/***/ }),

/***/ "./src/Middleware/authorize.ts":
/*!*************************************!*\
  !*** ./src/Middleware/authorize.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.authorizeMe = void 0;\nconst jwt_1 = __webpack_require__(/*! @src/utils/jwt */ \"./src/utils/jwt.ts\");\nconst authorizeMe = async (req, res, next) => {\n    try {\n        const authHeader = req.headers.authorization;\n        if (!authHeader?.startsWith(\"Bearer \")) {\n            res.status(401).json({ message: \"Authorization token missing or invalid\" });\n            return;\n        }\n        const token = authHeader.split(\" \")[1];\n        const decoded = (0, jwt_1.verifyToken)(token);\n        req.user = decoded; // Attach the decoded token to the request\n        next(); // Proceed to the next middleware or handler\n    }\n    catch (error) {\n        res.status(403).json({ message: \"Invalid or expired token\" });\n    }\n};\nexports.authorizeMe = authorizeMe;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Middleware/authorize.ts?");

/***/ }),

/***/ "./src/Middleware/errorHandler.ts":
/*!****************************************!*\
  !*** ./src/Middleware/errorHandler.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.errorHandler = void 0;\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/config/index.ts\");\nconst zod_1 = __webpack_require__(/*! zod */ \"zod\");\nconst ValidationError_1 = __webpack_require__(/*! ../utils/ValidationError */ \"./src/utils/ValidationError.ts\");\n// Ensure correct typing of the middleware\nconst errorHandler = async (err, req, res, next) => {\n    try {\n        if (res.headersSent) {\n            return next(err); // Pass to default error handler if headers already sent\n        }\n        if (err instanceof zod_1.ZodError) {\n            res.status(400).json({\n                success: false,\n                message: 'Validation failed',\n                errors: (0, ValidationError_1.formatZodError)(err),\n                code: 'VALIDATION_ERROR',\n            });\n            return; // Ensure we don't call `next()` after sending a response\n        }\n        const statusCode = err.statusCode || 500;\n        console.error(err);\n        res.status(statusCode).json({\n            success: false,\n            message: err.message || 'Internal server error',\n            code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',\n            ...(config_1.CONFIG.NODE_ENV === 'development' && { stack: err.stack }),\n        });\n    }\n    catch (error) {\n        next(error); // Handle unexpected errors gracefully\n    }\n};\nexports.errorHandler = errorHandler;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Middleware/errorHandler.ts?");

/***/ }),

/***/ "./src/Routes/Auth/index.ts":
/*!**********************************!*\
  !*** ./src/Routes/Auth/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Auth_1 = __webpack_require__(/*! @src/Controller/Auth */ \"./src/Controller/Auth/index.ts\");\nconst Otp_1 = __webpack_require__(/*! @src/Controller/Otp */ \"./src/Controller/Otp/index.ts\");\nconst asyncHandler_1 = __webpack_require__(/*! @src/Middleware/asyncHandler */ \"./src/Middleware/asyncHandler.ts\");\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst router = (0, express_1.Router)();\nrouter.post(\"/register\", (0, asyncHandler_1.asyncHandler)(Auth_1.register));\nrouter.post(\"/sendOtp\", (0, asyncHandler_1.asyncHandler)(Otp_1.sendOTPController));\nrouter.post(\"/verifyOtp\", (0, asyncHandler_1.asyncHandler)(Otp_1.verifyOTPController));\nexports[\"default\"] = router;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Routes/Auth/index.ts?");

/***/ }),

/***/ "./src/Routes/me/index.ts":
/*!********************************!*\
  !*** ./src/Routes/me/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst me_1 = __webpack_require__(/*! @src/Controller/me */ \"./src/Controller/me/index.ts\");\nconst asyncHandler_1 = __webpack_require__(/*! @src/Middleware/asyncHandler */ \"./src/Middleware/asyncHandler.ts\");\nconst authorize_1 = __webpack_require__(/*! @src/Middleware/authorize */ \"./src/Middleware/authorize.ts\");\nconst MulterUpload_1 = __webpack_require__(/*! @src/utils/MulterUpload */ \"./src/utils/MulterUpload.ts\");\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst router = (0, express_1.Router)();\nconst uploadVendorDocument = MulterUpload_1.Fileupload.fields([\n    { name: \"avatar\", maxCount: 1 },\n]);\nrouter.post(\"/editProfile\", authorize_1.authorizeMe, uploadVendorDocument, (0, asyncHandler_1.asyncHandler)(me_1.meController.editProfile));\nrouter.get(\"/profile\", authorize_1.authorizeMe, (0, asyncHandler_1.asyncHandler)(me_1.meController.getProfile));\nexports[\"default\"] = router;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Routes/me/index.ts?");

/***/ }),

/***/ "./src/Routes/posts/index.ts":
/*!***********************************!*\
  !*** ./src/Routes/posts/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst post_1 = __webpack_require__(/*! @src/Controller/post */ \"./src/Controller/post/index.ts\");\nconst asyncHandler_1 = __webpack_require__(/*! @src/Middleware/asyncHandler */ \"./src/Middleware/asyncHandler.ts\");\nconst authorize_1 = __webpack_require__(/*! @src/Middleware/authorize */ \"./src/Middleware/authorize.ts\");\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst router = (0, express_1.Router)();\nrouter.post(\"/addPost\", authorize_1.authorizeMe, (0, asyncHandler_1.asyncHandler)(post_1.postController.addNewPost));\nrouter.get(\"/getMyPosts\", authorize_1.authorizeMe, (0, asyncHandler_1.asyncHandler)(post_1.postController.getMyPosts));\nexports[\"default\"] = router;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Routes/posts/index.ts?");

/***/ }),

/***/ "./src/Server/app.ts":
/*!***************************!*\
  !*** ./src/Server/app.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst cors_1 = __importDefault(__webpack_require__(/*! cors */ \"cors\"));\nconst helmet_1 = __importDefault(__webpack_require__(/*! helmet */ \"helmet\"));\nconst errorHandler_1 = __webpack_require__(/*! ../Middleware/errorHandler */ \"./src/Middleware/errorHandler.ts\");\nconst Auth_1 = __importDefault(__webpack_require__(/*! ../Routes/Auth */ \"./src/Routes/Auth/index.ts\"));\nconst me_1 = __importDefault(__webpack_require__(/*! ../Routes/me */ \"./src/Routes/me/index.ts\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nconst posts_1 = __importDefault(__webpack_require__(/*! ../Routes/posts */ \"./src/Routes/posts/index.ts\"));\nconst app = (0, express_1.default)();\n// Middleware\napp.use((0, helmet_1.default)());\napp.use((0, cors_1.default)());\n// app.use(compression());\napp.use(express_1.default.json());\napp.use(express_1.default.urlencoded({ extended: true }));\napp.use(\"/public\", express_1.default.static(path_1.default.resolve(\"./public\"), {\n    setHeaders: (res) => {\n        res.setHeader(\"Cross-Origin-Resource-Policy\", \"cross-origin\");\n    },\n}));\n// Routes\n// app.use(\"/\", (req, res) => {\n//   res.send(\"Service Rental API\");\n// });\napp.use(\"/api/auth\", Auth_1.default);\napp.use(\"/api/me\", me_1.default);\napp.use(\"/api/post\", posts_1.default);\n// Error handling (ensure this is after all other middleware and routes)\napp.use(errorHandler_1.errorHandler);\nexports[\"default\"] = app;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Server/app.ts?");

/***/ }),

/***/ "./src/Server/server.ts":
/*!******************************!*\
  !*** ./src/Server/server.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst app_1 = __importDefault(__webpack_require__(/*! ./app */ \"./src/Server/app.ts\"));\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\nconst port = process.env.PORT || 9000;\napp_1.default.listen(port, () => {\n    /* eslint-disable no-console */\n    console.log(`Server Rental Running : http://localhost:${port}`);\n    /* eslint-enable no-console */\n});\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/Server/server.ts?");

/***/ }),

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CONFIG = void 0;\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\ndotenv_1.default.config();\nexports.CONFIG = {\n    PORT: process.env.PORT || 3000,\n    NODE_ENV: \"development\" || 0,\n    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',\n    DATABASE_URL: process.env.DATABASE_URL\n};\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/config/index.ts?");

/***/ }),

/***/ "./src/utils/ApiError.ts":
/*!*******************************!*\
  !*** ./src/utils/ApiError.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiError = void 0;\nclass ApiError extends Error {\n    statusCode;\n    errors;\n    constructor(statusCode, message, errors) {\n        super(message);\n        this.statusCode = statusCode;\n        this.errors = errors;\n        Error.captureStackTrace(this, this.constructor);\n    }\n}\nexports.ApiError = ApiError;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/utils/ApiError.ts?");

/***/ }),

/***/ "./src/utils/MulterUpload.ts":
/*!***********************************!*\
  !*** ./src/utils/MulterUpload.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Fileupload = void 0;\nconst multer_1 = __importDefault(__webpack_require__(/*! multer */ \"multer\"));\nexports.Fileupload = (0, multer_1.default)({\n    storage: multer_1.default.memoryStorage(),\n    limits: { fileSize: 20 * 1024 * 1024 }, // 5MB limit\n});\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/utils/MulterUpload.ts?");

/***/ }),

/***/ "./src/utils/ValidationError.ts":
/*!**************************************!*\
  !*** ./src/utils/ValidationError.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.formatZodError = void 0;\nconst formatZodError = (error) => {\n    return error.errors.map(err => ({\n        field: err.path.join('.'),\n        message: err.message\n    }));\n};\nexports.formatZodError = formatZodError;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/utils/ValidationError.ts?");

/***/ }),

/***/ "./src/utils/emailOtpMailer.ts":
/*!*************************************!*\
  !*** ./src/utils/emailOtpMailer.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EmailVerification = EmailVerification;\nconst nodemailer_1 = __importDefault(__webpack_require__(/*! nodemailer */ \"nodemailer\"));\nconst transporter = nodemailer_1.default.createTransport({\n    host: \"smtpout.secureserver.net\",\n    port: 465,\n    secure: true,\n    auth: {\n        user: \"noreply@cashkr.com\",\n        pass: \"NoReply@1212@CK\",\n    },\n});\nasync function EmailVerification(email, verificationCode) {\n    const logo = \"https://cashkr.blr1.cdn.digitaloceanspaces.com/Cashkr-Logo/logo.png\";\n    const htmlTemplate = `\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Rental Service OTP Verfication</title>\n    <style>\n      body {\n        font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto,\n          Helvetica, Arial, sans-serif;\n        background-color: #ffffff;\n        margin: 0;\n        padding: 20px;\n        color: #1c1e21;\n        line-height: 1.34;\n      }\n      .container {\n        max-width: 600px;\n        margin: 0 auto;\n      }\n      .header {\n        margin-bottom: 24px;\n      }\n      .header img {\n        width: 40px;\n        height: 40px;\n      }\n      .content {\n        margin-bottom: 24px;\n        font-size: 17px;\n      }\n      h1 {\n        font-size: 17px;\n        margin: 0;\n        padding: 0;\n        font-weight: normal;\n      }\n      .code-container {\n        background-color: #f0f2f5;\n        border-radius: 6px;\n        padding: 12px 24px;\n        margin: 16px 0;\n        display: inline-block;\n        border: 1px solid #e4e6eb;\n      }\n      .code {\n        font-size: 24px;\n        font-family: SFMono-Regular, Consolas, \"Liberation Mono\", Menlo,\n          monospace;\n        letter-spacing: 1px;\n        color: #050505;\n      }\n      .footer {\n        color: #65676b;\n        font-size: 13px;\n        margin-top: 24px;\n        padding-top: 16px;\n        border-top: 1px solid #ced0d4;\n      }\n      .footer a {\n        color: #1877f2;\n        text-decoration: none;\n      }\n      .footer p {\n        margin: 8px 0;\n      }\n      .footer strong {\n        color: #050505;\n      }\n      .meta-logo {\n        width: 60%;\n        margin-top: 8px;\n        color: #65676b;\n      }\n      .address {\n        color: #8a8d91;\n        font-size: 11px;\n        margin-top: 12px;\n      }\n      .security-notice {\n        color: #65676b;\n        font-size: 13px;\n        margin-top: 8px;\n      }\n      .header2 {\n        display: flex;\n        align-items: center;\n        gap: 4px;\n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <div class=\"header\">\n        <img src=\"${logo}\" alt=\"Rental Logo\" />\n      </div>\n      <hr style=\"opacity: 30%; margin-top: 8px; margin-bottom: 8px\" />\n      <div class=\"content\">\n        <h1>Hi ${email},</h1>\n        <p>We received a request to verify your email address.</p>\n        <p>Enter the following code to verify your email :</p>\n        <div class=\"code-container\">\n          <span class=\"code\">${verificationCode}</span>\n        </div>\n\n        <hr style=\"opacity: 30%; margin-top: 8px; margin-bottom: 20px\" />\n        <div class=\"meta-logo\">\n          <div class=\"header2\">\n            <img height=\"25px\" width=\"25px\" src=\"${logo}\" alt=\"Rental Logo\" />\n            <strong style=\"margin-left:4px;\">Rental Service</strong>\n          </div>\n        </div>\n        <p class=\"address\">© Rental Inc., Attention: Community Support</p>\n        <p class=\"security-notice\">This message was sent to ${email}</p>\n      </div>\n    </div>\n  </body>\n</html>\n`;\n    try {\n        const info = await transporter.sendMail({\n            from: '\"Rental Service\" <noreply@cashkr.com>',\n            to: email,\n            subject: \"Otp Verification Code\",\n            text: `${verificationCode} is your Rental Service Otp Verification Code.`,\n            headers: {\n                \"X-Entity-Ref-ID\": Date.now().toString(),\n            },\n            references: [],\n            inReplyTo: \"\",\n            messageId: `${Date.now()}.${Math.random()\n                .toString()\n                .slice(2)}@najeekai.com`,\n            html: htmlTemplate,\n        });\n        console.log(\"Message sent: %s\", info.messageId);\n    }\n    catch (error) {\n        console.error(\"Error sending email:\", error);\n    }\n}\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/utils/emailOtpMailer.ts?");

/***/ }),

/***/ "./src/utils/jwt.ts":
/*!**************************!*\
  !*** ./src/utils/jwt.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.verifyToken = exports.generateToken = void 0;\nconst jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\"));\n// Secret key (use an environment variable in production)\nconst JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';\n/**\n * Generates a JWT token.\n * @param payload - The data to encode in the JWT token.\n * @param expiresIn - Optional token expiration time (default is 1 hour).\n * @returns The generated JWT token.\n */\nconst generateToken = (payload) => {\n    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: \"30d\" });\n};\nexports.generateToken = generateToken;\n/**\n * Verifies a JWT token.\n * @param token - The JWT token to verify.\n * @returns The decoded payload if the token is valid.\n * @throws An error if the token is invalid or expired.\n */\nconst verifyToken = (token) => {\n    try {\n        return jsonwebtoken_1.default.verify(token, JWT_SECRET);\n    }\n    catch (error) {\n        throw new Error('Invalid or expired token');\n    }\n};\nexports.verifyToken = verifyToken;\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/utils/jwt.ts?");

/***/ }),

/***/ "./src/utils/prisma.ts":
/*!*****************************!*\
  !*** ./src/utils/prisma.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.prisma = void 0;\n// utils/prisma.ts\n// import { PrismaClient } from \"@prisma/client\";\nconst client_1 = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\nconst globalForPrisma = global;\nexports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();\nif (true) {\n    globalForPrisma.prisma = exports.prisma;\n}\n\n\n//# sourceURL=webpack://@servicerental/backend/./src/utils/prisma.ts?");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-rate-limit":
/*!*************************************!*\
  !*** external "express-rate-limit" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("express-rate-limit");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "zod":
/*!**********************!*\
  !*** external "zod" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("zod");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/Server/server.ts");
/******/ 	
/******/ })()
;