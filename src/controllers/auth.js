import {
  registerUserService,
  loginUserService,
  refreshUsersSessionService,
  logoutUserService,
  requestResetTokenService,
  resetPasswordService,
  validateResetTokenService
} from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: session.refreshTokenValidUntil,
  });
};

//--------------------registerUserController--------------------
export const registerUserController = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await registerUserService({ name, email, password });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
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
      accessToken: session.accessToken,
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


