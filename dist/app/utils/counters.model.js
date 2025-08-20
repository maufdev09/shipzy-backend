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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
exports.getNextSequence = getNextSequence;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    sequenceValue: { type: Number, default: -1 }
});
exports.Counter = (0, mongoose_1.model)("Counter", counterSchema);
function getNextSequence(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const counter = yield exports.Counter.findByIdAndUpdate(name, { $inc: { sequenceValue: 1 } }, { new: true, upsert: true });
        return counter === null || counter === void 0 ? void 0 : counter.sequenceValue;
    });
}
