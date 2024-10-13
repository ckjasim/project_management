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
}
