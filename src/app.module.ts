import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
// import { AccessTokenAuth } from './common/Accesstoken.auth.guard';
import { BarangModule } from './item/barang.module';
import { CollaboratorController } from './collaborator/collaborator.controller';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CartModule } from './cart/cart.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.MAIL_USER}>`,
      },
      template: {
        dir: process.cwd() + '/src/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      }
    }), CommonModule, UserModule, BarangModule, CollaboratorModule, CartModule, AdminModule],
  controllers: [CollaboratorController, AdminController],
  providers: [AdminService],
})
export class AppModule { }


