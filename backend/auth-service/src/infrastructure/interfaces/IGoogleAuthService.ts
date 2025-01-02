import { RequestHandler } from "express";

export  interface IGoogleAuthService {
    googleAuth(): RequestHandler; // Updated to return RequestHandler
    googleCallback(): RequestHandler; // Updated to return RequestHandler
}

export  interface IDriveAuthService {
    driveAuth(): RequestHandler; // Updated to return RequestHandler
    driveCallback(): RequestHandler; // Updated to return RequestHandler
}
