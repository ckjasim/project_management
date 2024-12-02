export default interface IEmailService {
  sendOTP(email: string, otp: string): Promise<void>;
  sendInvitation(data:any): Promise<void>;
}
