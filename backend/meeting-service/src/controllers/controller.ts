import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import ITaskController from '../infrastructure/interfaces/IController';
import IJwt from '../infrastructure/interfaces/IJwt';
import { TaskCreatedPublisher } from '../infrastructure/util/kafka/producer/producer';
import kafkaWrapper from '../infrastructure/util/kafka/kafkaWrapper';
import { Producer } from 'kafkajs';
import IController from '../infrastructure/interfaces/IController';
import { IInteractor } from '../infrastructure/interfaces/IInteractors';

@injectable()
class controller implements IController {
  private interactor: IInteractor;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.interactor) inter: IInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt
  ) {
    this.interactor = inter;
    this.jwt = jwt;
  }
  
    async createMeetingHandler(req: Request, res: Response, next: NextFunction) {
      try {
        const{_id}= JSON.parse(req.headers['user'] as string)

        console.log(req.body)
        const {title,date,teams,duration,meetingLink,time}=req.body.data
        const payload = {
          title,date,teams,duration,organizer:_id,meetingLink,time
        }
        const createdMeeting = await this.interactor.createMeeting(payload);
        res
          .status(201)
          .json({ message: 'meeting created successfully', createdMeeting });
      } catch (error) {
        next(error);
      }
    }

 
  async getMeetingsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      let meetings
      const{_id,role}= JSON.parse(req.headers['user'] as string)
      if(role==='project manager'){
       meetings=await this.interactor.getMeetingsByOrganizer(_id)
  console.log(meetings)
      }else{

        const teamId=await this.interactor.getTeamIdByUserId(_id)
        console.log(teamId,'teammms ===============')
         meetings = await this.interactor.getMeetingsByTeamId(teamId);
  console.log(meetings,'=00000000000000000000')

      }

      res.status(200).send({ message: 'Tasks successfully found', meetings });
    } catch (error) {
      next(error);
    }
  }



//   async getTaskByProjectIdHandler(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<any> {
//     try {

// const projectId=Object.keys(req.body)[0];

// const token = req.cookies['jwt'];
// if (!token) {
//   return res.status(401).json({ message: 'No token provided' });
// }
// let decodedData;
// try {
//   decodedData = await this.jwt.verifyRefreshToken(token);
// } catch (error) {
//   return res.status(401).json({ message: 'Invalid or expired token' });
// }
// const { user } = decodedData;
// const userId = user._id;
// console.log(userId)
// const teamId =await this.interactor.getTeamIdByUserId(userId)
 
//       const tasks=await this.interactor.getTaskByProjectId(projectId,teamId)
//       console.log(tasks)

//       res.status(200).send({ message: 'Tasks successfully found', tasks });
//     } catch (error) {
//       next(error);
//     }
//   }




  // async getProjectByTeamHandler(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> {
  //   try {

  //     const token = req.cookies['jwt'];
  //     if (!token) {
  //       return res.status(401).json({ message: 'No token provided' });
  //     }
  //     let decodedData;
  //     try {
  //       decodedData = await this.jwt.verifyRefreshToken(token);
  //     } catch (error) {
  //       return res.status(401).json({ message: 'Invalid or expired token' });
  //     }
  //     const { user } = decodedData;
  //     const userId = user._id;
  //     console.log(userId)
  //     const teamId =await this.interactor.getTeamIdByUserId(userId)
  //     console.log(teamId,'tamid-------------------')
  //     const projects=await this.interactor.getProjectsByTeamId(teamId)
  //     console.log(projects)

  //     res.status(200).send({ message: 'Tasks successfully found', projects });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

















  // async updateTaskStatusHandler(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> {
  //   try {
  //     console.log(req.body);
  //     const { taskId, status } = req.body;
  //     console.log(taskId, status.status, 'dddddddddddddddddddddddddd');
  //     const tasks = await this.interactor.updateTaskStatus(
  //       taskId,
  //       status.status
  //     );

  //     res.status(200).send({ message: 'Tasks successfully updataed' });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async deleteTaskHandler(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     console.log(req.body);
  //     const { id } = req.body;
  //     console.log(id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  //     const tasks = await this.interactor.deleteTask(id);

  //     res.status(200).send({ message: 'Tasks successfully deleted' });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async updateTaskHandler(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {  
  //     console.log(req.body);  
  //     const { id, data } = req.body;
  //     console.log(id, 'rrrrrrrrrrrrrrrrrrrrrrrr');
      
  //     const tasks = await this.interactor.updateTask(id, data);
  //     console.log(tasks,'--------------ddd')

  //     res.status(200).send({ message: 'Tasks successfully updated',tasks });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default controller;
