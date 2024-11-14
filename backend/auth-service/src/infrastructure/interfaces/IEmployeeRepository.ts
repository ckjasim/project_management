import IEmployee from "./IEmployee";

export default interface IEmployeeRepository {
  findByEmail(email: string): Promise<IEmployee | null>;
  create(data: IEmployee): Promise<IEmployee>;
  find(): Promise<IEmployee[]>;
  block(email: string): Promise<IEmployee | null> ;
  unBlock(email: string): Promise<IEmployee|null>;
  blockOrUnblock(email: string): Promise<any>;
  getEmployee(organization:string):Promise<IEmployee[]>

}
