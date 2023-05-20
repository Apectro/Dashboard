"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const data_1 = __importDefault(require("./routes/data"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/data', data_1.default);
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://marijo:Nikolina06@cluster0.o7deldw.mongodb.net/?retryWrites=true&w=majority';
// Declare io in the module scope
let io;
exports.io = io;
mongoose_1.default
    .connect(MONGODB_URI, {
    useUnifiedTopology: true,
})
    .then(() => {
    // Create a new HTTP server and wrap the Express app
    const httpServer = new http_1.Server(app);
    // Initialize io inside the callback
    exports.io = io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    // Make io accessible to our router files
    app.use(function (req, res, next) {
        if (io) {
            req.io = io;
        }
        next();
    });
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
