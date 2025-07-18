const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const log = require('@haensl/iso-log');

const init = () => {
  const app = initializeApp();

  if (!(app && app.name)) {
    const error = new Error('Failing to initialize Firebase app');

    throw error;
  }

  log.info(`Firebase app ${app.name} initialized.`);
};

/**
 * Checks whether the given error is a duplicate sign up e-mail.
 */
const isDuplicateEmailError = (error) => {
  if ('errorInfo' in error) {
    return error.errorInfo.code === 'auth/email-already-exists';
  }

  return error.code === 'auth/email-already-exists';
};

/**
 * Checks whether the given error is a user not found error.
 */
const isNotFoundError = (error) => {
  if ('errorInfo' in error) {
    return error.errorInfo.code === 'auth/user-not-found';
  }

  return error.code === 'auth/user-not-found';
};

/**
 * Checks whether the given error is a invalid device token error.
 */
const isInvalidDeviceTokenError = (error) => {
  if ('errorInfo' in error) {
    return error.errorInfo.code === 'messaging/invalid-registration-token'
      || error.errorInfo.code === 'messaging/registration-token-not-registered';
  }

  return error.code === 'messaging/invalid-registration-token'
    || error.code === 'messaging/registration-token-not-registered';
};

/**
 * Gets a user's firebase id token (JWT).
 */
const getUserIdToken = (userId) =>
  getAuth()
    .createCustomToken(userId)
    .then((token) => {
      const [header, payload] = token.split('.');
      const payloadBuffer = Buffer.from(payload, 'base64');
      const data = JSON.parse(payloadBuffer.toString());
      data.sub = data.uid;
      delete data.uid;
      const updatedPayloadBuffer = Buffer.from(JSON.stringify(data));

      return `Bearer ${header}.${updatedPayloadBuffer.toString('base64')}`;
    });

/**
 * Compiles a firebase cloud message.
 */
const message = ({
  // Notification category
  category,

  // Data payload to send with the message
  data,

  // Notification body
  body,

  // Localized string key of notification body
  locKey,

  // Format arguments to notification body
  locArgs,

  // Device tokens to deliver to
  tokens,

  // Notification title
  title,

  // Localized string key of notification title
  titleLocKey,

  // Format arguments to notification title
  titleLocArgs
}) => ({
  apns: {
    payload: {
      aps: {
        alert: {
          body,
          locKey,
          locArgs,
          title,
          titleLocKey,
          titleLocArgs
        },
        category,
        mutableContent: true
      }
    }
  },
  data,
  tokens
});

const service = {
  getUserIdToken,
  init,
  isDuplicateEmailError,
  isNotFoundError,
  isInvalidDeviceTokenError,
  message
};

module.exports = service;
