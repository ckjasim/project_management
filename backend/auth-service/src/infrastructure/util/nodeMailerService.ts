import { PRE_DESTROY } from 'inversify/lib/constants/metadata_keys';
import  IEmailService from '../interfaces/IEmailService';
import nodemailer from 'nodemailer';
import { injectable } from 'inversify';

@injectable()
export class NodeMailerService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `Your OTP is ${otp}`,
    };
    await this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Your mail has been sent' + info.response);
        console.log(otp);
      }
    });
  }

  async sendInvitation(data:any): Promise<void> {
   
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.to,
      subject: 'You\'ve been invited to join our platform',
      html: `
        <h1>Invitation to Join</h1>
        <p>Hello ${data.name},</p>
        <p>You've been invited to join as a ${data.jobRole} by ${data.invitedBy}.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${data.invitationLink}">Accept Invitation</a>
        <p>This link will expire in 7 days.</p>
      `,
    };
    await this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Your mail has been sent' + info.response);
        
      }
    });
  }
}
