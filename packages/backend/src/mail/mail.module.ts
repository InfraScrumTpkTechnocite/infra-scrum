import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        //host: 'smtp-relay.sendinblue.com',
        host: 'in-v3.mailjet.com',
        port: 587,
        secure: false,
        auth: {
          //user: 'benot_degreve@yahoo.fr',
          user: 'e061fa9d364d4b7bf61c4200cdec2c9a',
          //pass: 'GxOhA4YmvBD8yLcI',
          pass: '4809d004b6a0b93efe9fc9722eb9e0f6'
        },
      },
      defaults: {
        from: '"No Reply" <benoit.degreve@technocite.edu.eu>',
      },
      template: {
        dir: join(__dirname, '/templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {

}
