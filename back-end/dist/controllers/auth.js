"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, isAdmin } = req.body;
    // Check if the user is an admin
    const adminToken = req.header('x-auth-token');
    if (!adminToken) {
        return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(adminToken, process.env.JWT_SECRET);
        const adminUser = yield User_1.default.findById(decoded.id);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({ msg: 'Access denied. Not an admin user.' });
        }
        // Check if the username already exists
        let user = yield User_1.default.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Create a new user
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        user = new User_1.default({ username, password: hashedPassword, isAdmin });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(500).json({ msg: 'Server error', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });
        // Include isAdmin property in the response
        res.status(200).json({ token, isAdmin: user.isAdmin });
    }
    catch (error) {
        res.status(500).json({ msg: 'Server error', error });
    }
});
exports.login = login;
// Add test user to database
const addTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const username = 'testuser';
    const password = 'testpassword';
    const isAdmin = true;
    try {
        // Check if the user already exists
        let user = yield User_1.default.findOne({ username });
        if (user) {
            console.log(`User ${username} already exists`);
            return;
        }
        // Create a new user
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        user = new User_1.default({ username, password: hashedPassword, isAdmin });
        yield user.save();
        console.log(`User ${username} added to the database`);
    }
    catch (error) {
        console.log('Error adding test user to database', error);
    }
});
addTestUser();
