const firebase = require('./');

describe('firebase service', () => {
  describe('message()', () => {
    let message;
    let notification;

    beforeEach(() => {
      notification = {
        category: 'app.babayaga.notification.cyclesuperpower',
        data: {
          cycleSuperpower: 'sloth'
        },
        titleLocKey: 'app.babayaga.BabaYaga.notification.cyclesuperpower.title',
        tokens: [
          'fC8wxn07qUvsiN8_65m9qh:APA91bHLZkn5JtgL41PEP_eLoaacQMxcPxAsIrQpgbzIAVF1vot_MX5CX5tkSh4jVQLFbeazOVN73VZXPY5sAneQnDhIVg5ivOkXFgUnUSoX'
        ]
      };

      message = firebase.message(notification);
    });

    it('contains an APNs payload', () => {
      expect(typeof message.apns)
        .toEqual('object');
      expect(typeof message.apns.payload)
        .toEqual('object');
    });

    it('sets the localized title in the APS alert', () => {
      expect(message.apns.payload.aps.alert.titleLocKey)
        .toEqual(notification.titleLocKey);
    });

    it('sets sets the device tokens to deliver the notification to', () => {
      expect(message.tokens.length)
        .toEqual(1);
    });

    it('enables mutable APS message content', () => {
      expect(message.apns.payload.aps.mutableContent)
        .toEqual(true);
    });

    it('sets the category of the APS message', () => {
      expect(message.apns.payload.aps.category)
        .toEqual(notification.category);
    });
  });

  describe('isDuplicateEmailError()', () => {
    it('returns true for duplicate e-mail errors', () => {
      const error = new Error('Request failing Request undefined Error FirebaseAuthError: The email address is already in use by another account.');
      error.errorInfo = {
        code: 'auth/email-already-exists',
        message: 'The email address is already in use by another account.'
      };
      error.codePrefix = 'auth';
      const isDuplicateError = firebase.isDuplicateEmailError(error);
      expect(isDuplicateError)
        .toEqual(true);
    });

    it('returns false for other errors', () => {
      const error = new Error('Something broke');
      const isDuplicateError = firebase.isDuplicateEmailError(error);
      expect(isDuplicateError)
        .toEqual(false);
    });
  });

  describe('isInvalidDeviceTokenError()', () => {
    it('returns true for invalid registration token errors', () => {
      const error = new Error('Invalid registration token');
      error.errorInfo = {
        code: 'messaging/invalid-registration-token',
        message: 'Invalid registration token'
      };
      error.codePrefix = 'messaging';
      const isInvalidTokenError = firebase.isInvalidDeviceTokenError(error);
      expect(isInvalidTokenError)
        .toEqual(true);
    });

    it('returns true for non-registered registration token errors', () => {
      const error = new Error('Registration token not registered');
      error.errorInfo = {
        code: 'messaging/registration-token-not-registered',
        message: 'Registration token not registered'
      };
      error.codePrefix = 'messaging';
      const isInvalidTokenError = firebase.isInvalidDeviceTokenError(error);
      expect(isInvalidTokenError)
        .toEqual(true);
    });

    it('returns false for other errors', () => {
      const error = new Error('Something broke');
      const isInvalidTokenError = firebase.isInvalidDeviceTokenError(error);
      expect(isInvalidTokenError)
        .toEqual(false);
    });
  });

  describe('isNotFoundError()', () => {
    it('returns true for user not found errors', () => {
      const error = new Error('Request failing Request undefined Error FirebaseAuthError: User not found.');
      error.errorInfo = {
        code: 'auth/user-not-found',
        message: 'The email belongs to nobody.'
      };
      error.codePrefix = 'auth';
      const isNotFoundError = firebase.isNotFoundError(error);
      expect(isNotFoundError)
        .toEqual(true);
    });

    it('returns false for other errors', () => {
      const error = new Error('Something broke');
      const isNotFoundError = firebase.isNotFoundError(error);
      expect(isNotFoundError)
        .toEqual(false);
    });
  });
});

