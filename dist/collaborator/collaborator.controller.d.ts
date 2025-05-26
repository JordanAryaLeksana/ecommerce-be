import { CollaboratorService } from './collaborator.service';
import { CollaboratorRequest, CollaboratorResponse } from 'src/model/collaborator.model';
import { WebResponse } from 'src/model/web.model';
export declare class CollaboratorController {
    private collaboratorServivce;
    constructor(collaboratorServivce: CollaboratorService);
    addCollaborator(request: CollaboratorRequest): Promise<WebResponse<CollaboratorResponse>>;
}
