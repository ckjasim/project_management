
import IChat from './IChat';


export default interface IChatRepository {

  create( data: Partial<IChat>): Promise<IChat>;
  getChats(): Promise<Partial<IChat>[]>; 

}
