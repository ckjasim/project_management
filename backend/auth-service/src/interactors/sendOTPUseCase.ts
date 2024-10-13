import  IEmailService  from "../infrastructure/interfaces/IEmailService";



export class sendOTPUseCase {
  constructor(private emailService :IEmailService){

  }
  async execute(email:string,otp:string){
    await this.emailService.sendOTP(email ,otp)
  }
}