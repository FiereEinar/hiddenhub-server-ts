"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const not_found_1 = require("./src/middlewares/not-found");
const error_1 = require("./src/middlewares/error");
dotenv_1.default.config();
const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://messenger-app-blond.vercel.app'
    : 'http://localhost:5173';
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
}));
const mongodb_1 = __importDefault(require("./src/database/mongodb"));
(0, mongodb_1.default)();
// routers
const auth_1 = __importDefault(require("./src/routes/auth"));
const user_1 = __importDefault(require("./src/routes/user"));
const message_1 = __importDefault(require("./src/routes/message"));
const group_1 = __importDefault(require("./src/routes/group"));
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// routes
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/message', message_1.default);
app.use('/group', group_1.default);
app.use(not_found_1.notFoundHandler);
app.use(error_1.errorHandler);
app.listen(3000, () => console.log('Server is running on PORT 3000'));
exports.default = app;
