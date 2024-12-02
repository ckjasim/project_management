import IInvitation from './IInvitation';


export default interface IInvitationRepository {
  findInvitaionByEmail(email: string,organization:string): Promise<IInvitation | null>;
  findByToken(data: any): Promise<IInvitation | null>;
  create(data: IInvitation): Promise<IInvitation>;
  find():Promise<IInvitation[]>
  blockOrUnblock(email: string): Promise<any> ;
}
