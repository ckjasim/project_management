import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { inject, injectable } from "inversify";
import dotenv from "dotenv";
import INTERFACE_TYPES from "../constants/inversify";
import { IUserInteractor } from "../interfaces/IUserInteractors";
import { COOKIE_MAXAGE } from "../constants/timeAndDuration";
import {IGoogleAuthService} from "../interfaces/IGoogleAuthService";

dotenv.config();

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private interactor: IUserInteractor;
  private jwtService: any; 

  constructor(
    @inject(INTERFACE_TYPES.UserInteractor) userInteractor: IUserInteractor,
    @inject(INTERFACE_TYPES.jwt) jwtService: any 
  ) {
    this.interactor = userInteractor;
    this.jwtService = jwtService;
    this.setupPassport();
  }

  private setupPassport() {
    passport.use(
      new GoogleStrategy( 
        {
          clientID: process.env.CLIENT_ID as string,
          clientSecret: process.env.CLIENT_SECRET as string,
          callbackURL:"http://localhost:3000/google/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
          try {
            const { id, emails, displayName: name } = profile;
            const email = emails[0].value;
            let user = await this.interactor.findUserByEmail(email);


            if (!user) {
              user = await this.interactor.createUser({
                id,
                email,
                name,
                password: id, 
              });
            }

            const token = this.jwtService.generateToken(email);
            return done(null, { user, token });
          } catch (error) {
            console.error("Error during Google authentication:", error);
            return done(error, null);
          }
        }
      )
    );
  }

  public googleAuth(): RequestHandler {
    return passport.authenticate("google", { scope: ["profile", "email"] });
  }

  public googleCallback(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("google", async (err: any, user: { token: string; user: { email: string; }; }, info: any) => {
        if (err) {
          return res.status(500).send("Authentication error");
        }
        if (!user) {
          return res.status(401).redirect("/userLogin");
        }
        console.log(user)
        const token = user.token;
        const refreshToken = this.jwtService.generateRefreshToken(user.user.email);

        try {
          await this.interactor.createRefreshToken({
            email: user.user.email,
            token: refreshToken,
            expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
          });

          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_MAXAGE,
            path: '/',
          });

          return res.redirect("http://localhost:5173/user/dashboard"); 
        } catch (error) {
          console.error("Error saving refresh token:", error);
          return res.status(500).send("Internal server error");
        }
      })(req, res, next);
    };
  }
}
