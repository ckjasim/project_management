import IOtp from "./IOtp";

export default interface IOtpRepository {
  getOtp(email: string): Promise<IOtp | null>;
  create(data: IOtp): Promise<IOtp>;
}
