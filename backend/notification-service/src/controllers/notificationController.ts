
import { inject, injectable } from "inversify";
import IChatController from "../infrastructure/interfaces/INotificationController";
import INTERFACE_TYPES from "../infrastructure/constants/inversify";
import ChatInteractor from "../interactors/NotificationInteractor";
import { NextFunction, Request, Response } from "express";
import IJwt from "../infrastructure/interfaces/IJwt";
import NotificationInteractor from "../interactors/NotificationInteractor";
import INotificationController from "../infrastructure/interfaces/INotificationController";

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
class NotificationController implements INotificationController {
  private notificationInteractor: NotificationInteractor;
  private jwt: IJwt;


  constructor(
    @inject(INTERFACE_TYPES.NotificationInteractor) notificationInteractor: NotificationInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.notificationInteractor = notificationInteractor;
    this.jwt = jwt;
  }



  
  async getNotificationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const id =Object.keys(req.body)[0] 
      const notifications = await this.notificationInteractor.getNotification(id);

      res.status(200).send({ message: 'notification successfully found',notifications });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteNotificationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const id =Object.keys(req.body)[0] 
      const notifications = await this.notificationInteractor.deleteNotification(id);

      res.status(200).send({ message: 'deleted successfully ' });
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
      // const chats = await this.chatInteractor.getChats();
  
      res.status(200).send({ message: 'Teams successfully found', });
    } catch (error) {
      next(error);
    }
  }

}

export default NotificationController;