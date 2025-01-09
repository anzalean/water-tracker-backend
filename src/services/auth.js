import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/constants.js';

const createSession = (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

//--------------------registerUserService--------------------
export async function registerUserService(payload) {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email already exist');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
}

//--------------------loginUserService--------------------
export async function loginUserService(payload) {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(
      404,
      'User not found! Please, check the email address and try again.',
    );
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });
  const newSession = createSession(user._id);
  const createdSession = await Session.create(newSession);

  return {
    session: createdSession,
    user,
  };
}

//--------------------refreshUsersSessionService--------------------
export const refreshUsersSessionService = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: sessionId });
  const user = await User.findOne({ _id: session.userId });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const newSession = createSession(user._id);
  const createdSession = await Session.create(newSession);

  return {
    session: createdSession,
    user,
  };
};

//--------------------logoutUserService--------------------
export const logoutUserService = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
