"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ErrorFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
let ErrorFilter = ErrorFilter_1 = class ErrorFilter {
    logger = new common_1.Logger(ErrorFilter_1.name);
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        if (exception instanceof common_1.HttpException) {
            response.status(exception.getStatus()).json({
                errors: exception.getResponse()
            });
        }
        else if (exception instanceof zod_1.ZodError) {
            this.logger.error(`ZodError: ${JSON.stringify(exception.errors, null, 2)}`);
            response.status(400).json({
                errors: `Validation Error: ${exception.errors.map(err => err.message).join(', ')}`
            });
        }
        else {
            response.status(500).json({
                errors: exception instanceof Error ? exception.message : 'Unknown error'
            });
        }
    }
};
exports.ErrorFilter = ErrorFilter;
exports.ErrorFilter = ErrorFilter = ErrorFilter_1 = __decorate([
    (0, common_1.Catch)(zod_1.ZodError, common_1.HttpException)
], ErrorFilter);
//# sourceMappingURL=error.filter.js.map