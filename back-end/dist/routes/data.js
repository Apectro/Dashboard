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
const express_1 = __importDefault(require("express"));
const dataModel_1 = __importDefault(require("../models/dataModel"));
const index_1 = require("../index");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, data } = req.body;
    if (!category) {
        return res.status(400).send('Category is required');
    }
    if (!data) {
        return res.status(400).send('Data is required');
    }
    try {
        const newLog = yield dataModel_1.default.create({
            category,
            data,
        });
        // Emit a 'logsUpdated' event when data is updated
        index_1.io.emit('logsUpdated');
        return res.status(200).json(newLog);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allLogs = yield dataModel_1.default.find();
        return res.status(200).json(allLogs);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
}));
exports.default = router;
