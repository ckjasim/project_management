
import { inject, injectable } from "inversify";
import IChatController from "../infrastructure/interfaces/IChatController";
import INTERFACE_TYPES from "../infrastructure/constants/inversify";
import ChatInteractor from "../interactors/ChatInteractor";
import { NextFunction, Request, Response } from "express";
import IJwt from "../infrastructure/interfaces/IJwt";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'group' | 'private';
  roomId?: string;
  recipientId?: string;
}


@injectable()
class ChatController implements IChatController {
  private chatInteractor: ChatInteractor;
  private jwt: IJwt;


  constructor(
    @inject(INTERFACE_TYPES.ChatInteractor) chatInteractor: ChatInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.chatInteractor = chatInteractor;
    this.jwt = jwt;
  }


  
  async teamListByEmployeeHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const token = req.cookies['jwt'];
     
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      const { user } = decodedData;
      const employee = user?._id;
      const teams = await this.chatInteractor.getTeamsByEmployee(
        employee,
        user?.organization
      );
      res.status(200).send({ message: 'Teams successfully found',teams });
    } catch (error) {
      next(error);
    }
  }
  async getChatsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const chats = await this.chatInteractor.getChats();
      console.log(chats)
      res.status(200).send({ message: 'Teams successfully found',chats });
    } catch (error) {
      next(error);
    }
  }
  async markReadHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { messageIds } = req.body;
      const chats = await this.chatInteractor.markRead(messageIds);
      console.log(chats)
      res.status(200).send({ message: 'Teams successfully found',chats });
    } catch (error) {
      next(error);
    }
  }

}

export default ChatController;