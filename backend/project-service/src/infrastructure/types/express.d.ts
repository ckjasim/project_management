declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with a proper type if possible
    }
  }
}

