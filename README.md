# @haensl/firebase

Useful utitlities for working with [Firbase Admin SDK](https://firebase.google.com/docs/admi).

[![NPM](https://nodei.co/npm/@haensl%2Ffirebase.png?downloads=true)](https://nodei.co/npm/@haensl%2Ffirebase/)

[![npm version](https://badge.fury.io/js/@haensl%2Ffirebase.svg)](http://badge.fury.io/js/@haensl%2Ffirebase)

[![CircleCI](https://circleci.com/gh/haensl/firebase.svg?style=svg)](https://circleci.com/gh/haensl/firebase)

## Installation

```bash
npm i --save @haensl/firebase
```

## Usage

The module exports a set of utility functions useful in Firebase Admin SDK contexts

* [`getUserIdToken()`](#api/getUserIdToken) - generate a user JWT.
* [`init()`](#api/init) - initialize the Firebase app.
* [`isDuplicateEmailError()`](#api/isDuplicateEmailError) - check for duplicate email error.
* [`isNotFoundError()`](#api/isNotFoundError) - check for not found error.
* [`isInvalidDeviceTokenError()`](#api/isInvalidDeviceTokenError) - check for invalid device token error.
* [`message()`](#api/message) - compile a Firebase Cloud Message

#### `getUserIdToken: async (userId: string) => string` <a name="api/getUserIdToken"></a>

Returns a promise that resolves with a Firebase ID Bearer token (JWT) with subject set to the given `userId`.

#### `init: () => void` <a name="api/init"></a>

Initializes the Firebase app and SDK and **throws if the initialization fails**.

#### `isDuplicateEmailError: (Error) => boolean` <a name="api/isDuplicateEmailError"></a>

Checks whether the given error is a duplicate sign up e-mail error.

#### `isInvalidDeviceTokenError: (Error) => boolean` <a name="api/isInvalidDeviceTokenError"></a>

Checks whether the given error relates to an invalid device token.

#### `isNotFoundError: (Error) => boolean` <a name="api/isNotFoundError"></a>

Checks whether the given error is a user not found error.

#### `message: ({ category: string, data: object, body: string, locArgs: [string], locKey: string, tokens: [string], title: string, titleLocKey: string, titleLocArgs: [string] }) => object` <a name="api/message"></a>

Compiles a Firebae push notification from the given input.

##### Parameters

`category`: `string`

The push notification category.

`data`: `object`

Data payload to send with the notification.

`body`: `string`

Notificaion body. Expects localized, i.e. user-facing string. Prefe `locKey` if possible.

`locKey`: `string`

The localized string key to set as the message body.

`locArgs`: [`string`]

Formatting arguments to `locKey`.

`tokens`: `[string]`

An array of Firebase device tokens to send the notification to.

`title`: `string`

Notification title. Expects localized, i.e. user-facing string. Prefer `titleLocKey` if possible.

`titleLocKey`: `string`

The localized string key to set as the message title.

`titleLocArgs`: `[string]`

Formatting arguments to `locKey`.

##### Returns

The message compiled for handing to [`Firebase Messaging APIs`](https://firebase.google.com/docs/cloud-messaging/js/send-multiple#build_send_requests).

##### Example

```js
const firebase = require('@haensl/firebase');
const { getMessaging } = require('firebase-admin/messaging');

const sendMessage = async (user) => {
  firebase.init();

  const message = firebase.message({
    category: 'yo-mama-jokes',
    data: {
      payload: 'too large to handle'
    },
    tokens: [
      'user-device-token'
    ],
    titleLocKey: 'YoMamaSoPhat'
  });

  await getMessaging().sendMulticast(message);
};
```


## [Changelog](CHANGELOG.md)

## [License](LICENSE)
