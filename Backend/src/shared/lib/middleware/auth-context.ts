
import { asyncLocalStorage } from "../async-context";
import { Request, Response, NextFunction } from "express";

export function authContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string || "anonymous";
  const email = req.headers['x-user-email'] as string || "unknown@example.com";

  asyncLocalStorage.run({ userId, email }, () => {
    next();
  });
}
