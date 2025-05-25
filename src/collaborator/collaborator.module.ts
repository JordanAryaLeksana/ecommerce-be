import { Module } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorController } from './collaborator.controller';
import { CollaboratorValidation } from './collaborator.validation';
// import { CommonModule } from 'src/common/common.module';
@Module({
  imports: [
    // CommonModule
  ],
  providers: [CollaboratorService, CollaboratorValidation],
  controllers: [CollaboratorController],
  exports: [CollaboratorService],
})
export class CollaboratorModule {}
