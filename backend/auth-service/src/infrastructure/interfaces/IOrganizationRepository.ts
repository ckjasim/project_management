import IOrganization from './IOrganization';


export default interface IOrganizationRepository {
  findByEmail(email: string): Promise<IOrganization | null>;
  findById(id: string): Promise<IOrganization | null>;
  findOneAndUpdate(email: string): Promise<IOrganization | null>;
  create(data:Partial<IOrganization>): Promise<IOrganization>;
  find():Promise<IOrganization[]>
  blockOrUnblock(email: string): Promise<any> ;

}
