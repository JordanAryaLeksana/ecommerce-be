"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const prisma_service_1 = require("../common/prisma.service");
const validation_service_1 = require("../common/validation.service");
const winston_1 = require("winston");
const CollaboratorValidation = require("./collaborator.validation");
const mailer_1 = require("@nestjs-modules/mailer");
let CollaboratorService = class CollaboratorService {
    validationService;
    mailService;
    logger;
    prismaService;
    constructor(validationService, mailService, logger, prismaService) {
        this.validationService = validationService;
        this.mailService = mailService;
        this.logger = logger;
        this.prismaService = prismaService;
    }
    async addCollaborator(request) {
        this.logger.info('Add Collaborator: ' + JSON.stringify(request));
        const validated = this.validationService.validate(CollaboratorValidation.CollaboratorValidation.CREATE, request);
        const collaborator = await this.prismaService.collaborator.create({
            data: {
                name: validated.name,
                email: validated.email,
                role: validated.role,
            },
        });
        return {
            name: collaborator.name,
            email: collaborator.email,
            role: collaborator.role,
        };
    }
    async sendWelcomeEmail(request) {
        this.logger.info(`Sending welcome email to ${request.name} at ${request.email}`);
        await this.mailService.sendMail({
            to: request.email,
            subject: 'Welcome to PRAMSTORE Collaborator',
            from: process.env.EMAIL_USER,
            template: 'welcome',
            context: {
                name: request.name,
                email: request.email,
                role: request.role,
            },
        });
        if (!request.name || !request.email) {
            this.logger.error('Name or email is missing in the request');
            throw new Error('Name and email are required to send a welcome email');
        }
        return {
            name: request.name,
            email: request.email,
            role: request.role,
        };
    }
};
exports.CollaboratorService = CollaboratorService;
exports.CollaboratorService = CollaboratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [validation_service_1.ValidationService,
        mailer_1.MailerService,
        winston_1.Logger,
        prisma_service_1.PrismaService])
], CollaboratorService);
//# sourceMappingURL=collaborator.service.js.map