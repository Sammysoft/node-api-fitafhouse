import express from "express";
import { userController } from "../controllers/user-controller.js";
import { auth } from "../controllers/auth.js";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/onboarding", userController._onboard);
userRouter.post("/auth", auth._authUser);
userRouter.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).json({
      data: req.user,
    });
  }
);

userRouter.post("/invest/:id", userController._invest);
userRouter.get("/notifications/:id", userController._notifications);
userRouter.get("/investments/:id", userController._getInvestments);
userRouter.post("/payments", userController._initiatePayments);
userRouter.post("/profile/:id", userController._updateProfile);
userRouter.post("/support/", userController._sendMessage);
userRouter.get("/support/", userController._getMessages);
userRouter.post("/forgot-password/reset", userController._forgotPassword)
userRouter.post("/password-reset/:id", userController._resetPassword)

export default userRouter;
