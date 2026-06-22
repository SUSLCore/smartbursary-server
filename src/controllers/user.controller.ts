import {
  Request,
  Response,
  NextFunction,
} from "express";

import userService from "../services/user.service";

interface AuthRequest extends Request {
  user?: any;
}

class UserController {
  getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile =
        await userService.getProfile(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();