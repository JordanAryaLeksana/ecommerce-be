import { Controller } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorRequest, CollaboratorResponse } from '../model/collaborator.model';
import { WebResponse } from '../model/web.model';
import { Post, Body } from '@nestjs/common';


@Controller('api/collaborator')
export class CollaboratorController {
    constructor(
        private collaboratorServivce: CollaboratorService

    ){}

    @Post('/addCollaborator')
    async addCollaborator(@Body() request: CollaboratorRequest): Promise<WebResponse<CollaboratorResponse>> {
        const result = await this.collaboratorServivce.addCollaborator(request);

        await this.collaboratorServivce.sendWelcomeEmail(result);
        return {
            data: result,
           
        };
    }

}
