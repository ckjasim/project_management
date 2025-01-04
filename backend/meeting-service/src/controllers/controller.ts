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
import axios from 'axios'
import Stripe from 'stripe';
import { stripe } from '../infrastructure/util/stripe';


@injectable()
class Controller implements IController {
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
      const { _id } = JSON.parse(req.headers['user'] as string);

      console.log(req.body);
      const { title, date, teams, duration, meetingLink, time } = req.body.data;
      const payload = {
        title,
        date,
        teams,
        duration,
        organizer: _id,
        meetingLink,
        time,
      };
      const createdMeeting = await this.interactor.createMeeting(payload);
      res
        .status(201)
        .json({ message: 'Meeting created successfully', createdMeeting });
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
      let meetings;
      const { _id, role } = JSON.parse(req.headers['user'] as string);
      if (role === 'project manager') {
        meetings = await this.interactor.getMeetingsByOrganizer(_id);
      } else {
        const teamId = await this.interactor.getTeamIdByUserId(_id);
        meetings = await this.interactor.getMeetingsByTeamId(teamId);
      }

      res.status(200).send({ message: 'Meetings successfully found', meetings });
    } catch (error) {
      next(error);
    }
  }

  async deleteMeetingHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
console.log('meeet5tt')
      // const { _id, role } = JSON.parse(req.headers['user'] as string);
 
      const  dltMeetings = await this.interactor.deleteMeetingById(req.body.meetingId);
      console.log(dltMeetings,'llllllllllllllllllllllllllll')
      

      res.status(200).send({ message: 'Meetings deleted successfully ', dltMeetings });
    } catch (error) {
      next(error);
    }
  }

  async paymentHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { _id,email } = JSON.parse(req.headers['user'] as string);
   
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd', // Replace with your desired currency, e.g., 'inr'
              product_data: {
                name: 'Premium Service', // The name of your service
              },
              unit_amount: 99900, // Amount in cents (e.g., $9.99 -> 99900)
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/user/success`,
        cancel_url: `${process.env.CLIENT_URL}/user/cancel`,
        metadata: {
          userId: _id, 
          email:email
        },
  
      });
console.log(session.id)
      res.json({ sessionId: session.id }); // Send the session ID back to the client
    } catch (error) {
      next(error);
    }
  }

  async webhookHandler(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      console.log( process.env.STRIPE_WEBHOOK_SECRET,'lolooollooo')
      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err:any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // switch (event.type) {
      //   case 'checkout.session.completed': {
      //     const session = event.data.object as Stripe.Checkout.Session;
      //     console.log('Payment successful:', session);
      //     await this.savePayment(session);
      //     break;
      //   }
  
      //   case 'payment_intent.succeeded': {
      //     const paymentIntent = event.data.object as Stripe.PaymentIntent;
      //     console.log('PaymentIntent succeeded:', paymentIntent);
      //     await this.handlePaymentIntent(paymentIntent);
      //     break;
      //   }
  
      //   case 'charge.succeeded': {
      //     const charge = event.data.object as Stripe.Charge;
      //     console.log('Charge succeeded:', charge);
      //     await this.handleCharge(charge);
      //     break;
      //   }
  
      //   default:
      //     console.warn(`Unhandled event type: ${event.type}`);
      // }
      
if(event.type){
            const session = event.data.object as Stripe.Checkout.Session;
          console.log('Payment successful:', session);
          await this.savePayment(session);
}
      res.status(200).send('Webhook received');
    } catch (error) {
      next(error);
    }
  }
  async savePayment(session: Stripe.Checkout.Session): Promise<void> {
    const {userId,email } = session.metadata as {
      userId: string;
      email:string
  };
 try{
  console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
   const updateOrg = await axios.post('http://localhost:3000/updateSubscription',email)

 }catch(error){
console.log(error)
 }
  
  }

  
  
}

export default Controller;
