import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CollaboratorRequest, CollaboratorResponse } from 'src/model/collaborator.model';
import { Logger } from 'winston';
import { MailerService } from '@nestjs-modules/mailer';
export declare class CollaboratorService {
    private validationService;
    private readonly mailService;
    private logger;
    private prismaService;
    constructor(validationService: ValidationService, mailService: MailerService, logger: Logger, prismaService: PrismaService);
    addCollaborator(request: CollaboratorRequest): Promise<CollaboratorResponse>;
    sendWelcomeEmail(request: CollaboratorRequest): Promise<CollaboratorResponse>;
}
