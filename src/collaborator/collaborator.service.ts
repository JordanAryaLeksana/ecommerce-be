 
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { CollaboratorRequest, CollaboratorResponse } from '../model/collaborator.model';
import { Logger } from 'winston';
import * as CollaboratorValidation from './collaborator.validation';
import { MailerService } from '@nestjs-modules/mailer';





@Injectable()
export class CollaboratorService {
    constructor(
        private validationService: ValidationService,
        private readonly mailService: MailerService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) { }

    async addCollaborator(request: CollaboratorRequest): Promise<CollaboratorResponse> {
        this.logger.info('Add Collaborator: ' + JSON.stringify(request));

        const validated: CollaboratorRequest = this.validationService.validate<CollaboratorRequest>(
            CollaboratorValidation.CollaboratorValidation.CREATE,
            request,
        );

         
        const collaborator = await this.prismaService.collaborator.create({
            data: {
                name: validated.name,
                email: validated.email,
                role: validated.role,
            },
        }) as CollaboratorRequest

        return {
            name: collaborator.name,
            email: collaborator.email,
            role: collaborator.role,
        }
    }

    async sendWelcomeEmail(request: CollaboratorRequest): Promise<CollaboratorResponse> {
        this.logger.info(`Sending welcome email to ${request.name} at ${request.email}`);
       await this.mailService.sendMail ({
            to: request.email,
            subject: 'Welcome to PRAMSTORE Collaborator',
            from: process.env.EMAIL_USER,
            template: 'welcome',
            context: {
                name: request.name,
                email: request.email,
                role: request.role,
            },
        })
        if (!request.name || !request.email) {
            this.logger.error('Name or email is missing in the request');
            throw new Error('Name and email are required to send a welcome email');
        }
        return {
            name:request.name,
            email: request.email,
            role: request.role,
        }
    }
}
