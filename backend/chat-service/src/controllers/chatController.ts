
import { inject, injectable } from "inversify";
import IChatController from "../infrastructure/interfaces/IChatController";
import INTERFACE_TYPES from "../infrastructure/constants/inversify";
import ChatInteractor from "../interactors/ChatInteractor";
import { NextFunction, Request, Response } from "express";

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


  constructor(
    @inject(INTERFACE_TYPES.ChatInteractor) chatInteractor: ChatInteractor,
  ) {
    this.chatInteractor = chatInteractor;

  }


  
  async teamListByEmployeeHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const user  = JSON.parse(req.headers['user'] as string)
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
      console.log(messageIds,'iddddddddddddddddddddddddddddddddddd')
      const chats = await this.chatInteractor.markRead(messageIds);
      console.log(chats)
      res.status(200).send({ message: 'Teams successfully found',chats });
    } catch (error) {
      next(error);
    }
  }

}

export default ChatController;