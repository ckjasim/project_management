import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import dotenv from "dotenv";
import INTERFACE_TYPES from "../constants/inversify";
import { IUserInteractor } from "../interfaces/IUserInteractors";

dotenv.config();

@injectable()
export class GoogleAuthService {
  private interactor: IUserInteractor;

  constructor(@inject(INTERFACE_TYPES.UserInteractor) userInteractor: IUserInteractor) {
    this.interactor = userInteractor;
    this.setupPassport();
    console.log('111111111111111111111111')
  }

  private setupPassport() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.CLIENT_ID as string,
          clientSecret: process.env.CLIENT_SECRET as string,
          callbackURL: "https://localhost:3000/auth/google/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
          try {
            const { id, email, displayName: name } = profile;
            console.log(profile);

            let user = await this.interactor.findUserByEmail(email);
            if (!user) {
              user = await this.interactor.createUser({
                id,
                email,
                name,
                password: id, // Consider using a secure hash instead of the Google ID as the password
          
              });
            }

            return done(null, user);
          } catch (error) {
            console.error("Error during Google authentication:", error);
            return done(error, null);
          }
        }
      )
    );
  }

  public initializePassport() {
    passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
      try {
        const user = await this.interactor.findUserById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  public googleAuth() {
    return passport.authenticate("google", { scope: ["profile", "email"] });
  }

  public googleCallback() {
    return passport.authenticate("google", {
      failureRedirect: "/api/userLogin",
    });
  }

  public setupSession(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
      // Optionally store user information in session
      // req.session.user_id = req.user?.id;
      console.log('User authenticated:', req.user);
    }
    res.redirect("/");
  }
}
