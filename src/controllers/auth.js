import {
  registerUserService,
  loginUserService,
  refreshUsersSessionService,
  logoutUserService,
  updateUserService,
  loginOrSignupWithGoogle,
  requestResetTokenService,
  resetPasswordService,
  validateResetTokenService,
  getUserCounterService
} from '../services/auth.js';
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { generateAuthUrl } from "../utils/googleOAuth2.js";
import { env } from "../utils/env.js";


const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    expires: session.refreshTokenValidUntil,
  });
};

//--------------------registerUserController--------------------
export const registerUserController = async (req, res) => {
    const { email, password } = req.body;
    const newUser = await registerUserService({ email, password });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        email: newUser.email,
      },
    });
};

//--------------------loginUserController--------------------
export const loginUserController = async (req, res) => {
  const { session, user } = await loginUserService(req.body);

  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user,
    },
  });
};

//--------------------refreshUserSessionController--------------------
export const refreshSessionController = async (req, res) => {
  const { session, user } = await refreshUsersSessionService({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

//--------------------logoutUserController--------------------
export const logoutUserController = async (req, res) => {
  await logoutUserService(req.cookies.sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};


//--------------------updateUserController--------------------
export const updateUserController = async (req, res) => {
  const { id: userId } = req.user;
  const updates = req.body;
  const avatarPhoto = req.file;

  let avatarUrl;
  if (avatarPhoto) {
    if (env("ENABLE_CLOUDINARY") === "true") {
      avatarUrl = await saveFileToCloudinary(avatarPhoto);
    } else {
      avatarUrl = await saveFileToUploadDir(avatarPhoto);
    }
  }
  const user = await updateUserService(userId, {
    ...updates,
    avatarURL: avatarUrl,
  });

  res.json({
    status: 200,
    message: "User updated successfully",
    data: { user },
  });
};

//--------------------getGoogleOAuthUrlController--------------------
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: "Successfully get Google OAuth url!",
    data: {
      url,
    },
  });
};

//--------------------loginWithGoogleController--------------------
export const loginWithGoogleController = async (req, res) => {
  const { session, user } = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully logged in via Google OAuth!",
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

//--------------------resetMailController--------------------
export const requestResetEmailController = async (req, res) => {
  await requestResetTokenService(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

//--------------------validateResetTokenController--------------------
export const validateResetTokenController = async (req, res) => {
    const { token } = req.query;
    const decodedToken = await validateResetTokenService({ token });

    res.status(200).json({
        status: 200,
        message: "Token is valid",
        data: {
            decodedToken
        }
    });
};

//--------------------resetPasswordController--------------------
export const resetPasswordController = async (req, res) => {
    await resetPasswordService(req.body);
    res.json({
        message: 'Password was successfully reset!',
        status: 200,
        data: {}
    });
};

//--------------------getCurrentUserController--------------------
export const getCurrentUserController = async (req, res) => {
  const user = req.user;

  res.json({
    status: 200,
    message: 'User fetched successfully',
    data: {
      id: user._id,
      email: user.email,
      avatarURL: user.avatarURL,
      name: user.name,
      gender: user.gender,
      weight: user.weight,
      activityTime: user.activityTime,
      desiredVolume: user.desiredVolume,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

//--------------------getUserCountController--------------------
export const getUserCountController = async (req, res) => {
  const user = await getUserCounterService();
  res.json({
    status: 200,
    message: 'Number of customers successfully received on web-platform!',
    data: {
      user,
    },
  });
};






