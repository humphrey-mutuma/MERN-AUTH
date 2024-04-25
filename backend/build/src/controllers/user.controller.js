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
exports.deleteUser = exports.updateUser = exports.getUserDetails = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// @desc    Get a user
// @route   GET /api/users/ id
function getUserDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!(id === null || id === void 0 ? void 0 : id.trim())) {
            return res.status(200).json({ message: "User Id not Found" });
        }
        try {
            const user = yield user_model_1.default.findById(id, "-password");
            if (user) {
                return res.status(200).json(user);
            }
        }
        catch (error) {
            console.error(error);
            next(error); // Forward the error to the error handling middleware
        }
    });
}
exports.getUserDetails = getUserDetails;
// @desc    update user details
// @route   PUT /api/users/id
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name } = req.body;
        const { id } = req.params;
        if (!(email === null || email === void 0 ? void 0 : email.trim()) || !(name === null || name === void 0 ? void 0 : name.trim())) {
            return res.status(400).json({ message: "Missing email or name!" });
        }
        try {
            const updated_user = yield user_model_1.default.updateOne({
                id,
            }, {
                email,
                name,
            });
            if (updated_user) {
                return res.status(200).json(updated_user);
            }
        }
        catch (error) {
            console.error(error);
            next(error); // Forward the error to the error handling middleware
            return res.status(400).json(error);
        }
    });
}
exports.updateUser = updateUser;
// @desc    delete a user
// @route   DELETE /api/users/ id
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!(id === null || id === void 0 ? void 0 : id.trim())) {
            return res.status(400).json({ message: "Missing User id" });
        }
        try {
            const deletedUser = yield user_model_1.default.deleteOne({
                id: id,
            });
            if (deletedUser) {
                return res.status(200).json(deletedUser);
            }
        }
        catch (error) {
            console.error(error);
            next(error); // Forward the error to the error handling middleware
            return res.status(400).json(error);
        }
    });
}
exports.deleteUser = deleteUser;
