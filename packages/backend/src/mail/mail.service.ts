import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: User, token: string) {
        // const url = `http://localhost:3000/backend/auth/confirm/${user.username}/${token}`;
        const url = `http://localhost:4200/login?username=${user.username}&token=${token}`;
        console.log(`mail.service - sendUserConfirmation - user.email=${user.email}, user.username=${user.username}`)
        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.username,
                url,
            },
        });
    }
}
