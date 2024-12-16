
import IChat from './IChat';


export default interface INotificationRepository {

  // create( data: Partial<IChat>): Promise<IChat>;
  findById(id:string): Promise<any>; 
  deleteById(id:string): Promise<any>; 

}
