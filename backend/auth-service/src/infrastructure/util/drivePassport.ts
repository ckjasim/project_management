import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { inject, injectable } from "inversify";
import dotenv from "dotenv";
import INTERFACE_TYPES from "../constants/inversify";
import { IUserInteractor } from "../interfaces/IUserInteractors";
import { COOKIE_MAXAGE } from "../constants/timeAndDuration";
import {IDriveAuthService} from "../interfaces/IGoogleAuthService";
import IDrive from "../interfaces/IDrive";

dotenv.config();

@injectable()
export class DriveAuthService implements IDriveAuthService {
  private interactor: IUserInteractor;
  private jwtService: any;

  constructor(
    @inject(INTERFACE_TYPES.UserInteractor) userInteractor: IUserInteractor,
    @inject(INTERFACE_TYPES.jwt) jwtService: any
  ) {
    this.interactor = userInteractor;
    this.jwtService = jwtService;
    this.validateEnvVariables();
    this.setupPassport();
  }



  private validateEnvVariables() {
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      throw new Error("Google OAuth CLIENT_ID and CLIENT_SECRET must be set in the environment variables.");
    }
  }

  private setupPassport() {
    const SCOPES = ["profile", "email", "https://www.googleapis.com/auth/drive"];
    
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.CLIENT_ID as string,
          clientSecret: process.env.CLIENT_SECRET as string,
          callbackURL: "http://localhost:3000/google/driveCallback",
          scope: SCOPES,
          accessType: 'offline', // Add accessType here
          
        } as any, // Cast to 'any' to bypass type checking
        async (accessToken: string, refreshToken: string | undefined, profile: any, done: Function) => {
          console.log('Access Token:', accessToken);
          console.log('Refresh Token:', refreshToken);  // Check if refresh token is returned
    
          try {
            const user = {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              accessToken,
              refreshToken,  // Will now be available if accessType: 'offline' is set
            };
            done(null, user);
          } catch (error) {
            console.error("Error during Google authentication:", error);
            return done(error, null);
          }
        }
      )
    );
    
    
  }

  public driveAuth(): RequestHandler {
    return passport.authenticate("google", {
      scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
    });
  }

  public driveCallback(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("google", async (err: Error, user: any, info: any) => {
        if (err) {
          console.error("Authentication error:", err);
          return res.status(500).send("Authentication error");
        }
        if (!user) {
          return res.status(401).redirect("/userLogin");
        }
  
        const { email, accessToken, refreshToken } = user;
  
        try {
          const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      let decodedData;

        decodedData = await this.jwtService.verifyRefreshToken(token);
   
  
      const { organization } = decodedData.user;
              console.log(organization,'orgggggg')
            
          
  
          const driveData: Partial<IDrive> = {
            email,
            accessToken,
            refreshToken,
            organization, 
          };
  
          const existingDriveEntry = await this.interactor.findDriveByEmail(email);
  
          if (existingDriveEntry) {
            await this.interactor.updateDriveTokens(email, { accessToken, refreshToken });
          } else {
            await this.interactor.createDriveEntry(driveData);  
          }
  
          console.log("Drive tokens and organization successfully stored in the database.");
          return res.redirect("http://localhost:5173/user/files");
        } catch (error) {
          console.error("Error saving tokens to the database:", error);
          return res.status(500).send("Internal server error");
        }
      })(req, res, next);
    };
  }
  

}
