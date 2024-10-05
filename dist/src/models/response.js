"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonResponse {
    constructor(success, data, message, error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
    }
}
exports.default = JsonResponse;
