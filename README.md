### Google Analytics - [Measurement Protocol API](https://developers.google.com/analytics/devguides/collection/protocol/v1/)

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]


The main purpose of this was to be used with [Electron](http://electron.atom.io/) built apps.

#### Features
* Pageview
* Event
* Screenview
* Transaction
* Social
* Exception
* Refund
* Item
* User Timing Tracking
* Custom function for the rest (send)

#### Getting started
Installation
```
npm i google-analytics-electron
```

* Init

    `Analytics(trackingID, { userAgent, debug, version })`
    ```javascript
    import Analytics from 'google-analytics-electron'
    const analytics = new Analytics('UA-XXXXXXXX-X')
    ```

* Pageview

  `Analytics#pageview(hostname, url, title)`
  ```javascript
  return analytics.pageview('http://example.com', '/home', 'Example')
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```
  If you want to keep the session you need to specify the `clientID`.

* Event

  `Analytics#event(evCategory, evAction, { evLabel, evValue })`
  ```javascript
  const analytics = new Analytics('UA-XXXXXXXX-X', { clientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  return analytics.event('Video', 'play', { evLabel: 'holiday', evValue: 300})
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Screenview

  `Analytics#screen(screenName)`
  ```javascript
  const analytics = new Analytics('UA-XXXXXXXX-X', { 
    appName: 'test', 
    appVersion: '1.0.0', 
    appID: 'com.app.test', 
    appInstallerID:'com.app.installer'
  })
  return analytics.screen('Test')
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Transaction

  `Analytics#transaction(trnID, { trnAffil, trnRev, trnShip, trnTax, currCode } = {})`
  ```javascript
  return analytics.transaction(123)
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Social

  `Analytics#social(socialAction, socialNetwork, socialTarget)`
  ```javascript
  return analytics.social('like', 'facebook', 'home')
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Exception

  `Analytics#exception(exDesc, exFatal)`
  ```javascript
  return analytics.exception('IOException', 1)
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Refund

  `Analytics#refund(transactionID, evCategory = 'Ecommerce', evAction = 'Refund', nonInteraction = 1)`
  ```javascript
  return analytics.refund('T123')
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Item

  `Analytics#item(trnID, itemName, { itemPrice, itemQty, itemSku, itemVariation, currCode } = {})`
  ```javascript
  return analytics.item('123', 'Test item')
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* User Timing Tracking

  `Analytics#timingTrk(timingCtg, timingVar, timingTime, { timingLbl, dns, pageDownTime, redirTime, tcpConnTime, serverResTime } = {})`
  ```javascript
  return analytics.timingTrk('Category', 'jsonLoader', 123)
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

* Send (for everything else for now)

  `Analytics#send(hitType, params)`
  ```javascript
  return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
    .then((response) => {
      return response
    })
    .catch((err) => {
      return err
    })
  ```

#### Tests
```
cross-env TRACKING_ID='UA-XXXXXXXX-X' npm test
```

# License

MIT

[npm-image]: https://img.shields.io/npm/v/google-analytics-electron.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/google-analytics-electron
[travis-image]: https://img.shields.io/travis/arantes555/electron-google-analytics.svg?style=flat-square
[travis-url]: https://travis-ci.org/arantes555/electron-google-analytics
[codecov-image]: https://img.shields.io/codecov/c/github/arantes555/electron-google-analytics.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/arantes555/electron-google-analytics
