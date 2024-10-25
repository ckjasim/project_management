import { RequestHandler } from "express";

export default interface IGoogleAuthService {
    googleAuth(): RequestHandler; // Updated to return RequestHandler
    googleCallback(): RequestHandler; // Updated to return RequestHandler
}
