import uuidV4 from 'uuid/v4'
import fetch from 'electron-fetch'

export class AnalyticsError extends Error {
  constructor (text, data) {
    super(text)
    this.data = data
  }
}

export default class Analytics {
  /**
   * Class constructor
   */
  constructor (trackingID, { userAgent = '', debug = false, version = 1 } = {}) {
    // Debug
    this._debug = debug

    // User-agent
    this._userAgent = userAgent

    // Links
    this._baseURL = 'https://www.google-analytics.com'
    this._debugURL = '/debug'
    this._collectURL = '/collect'
    this._batchURL = '/batch'

    // Google generated ID
    this._trackingID = trackingID
    // Google API version
    this._version = version
  }

  get debug () {
    return this._debug
  }

  set debug (value) {
    this._debug = value
  }

  get userAgent () {
    return this._userAgent
  }

  set userAgent (value) {
    this._userAgent = value
  }

  get baseURL () {
    return this._baseURL
  }

  set baseURL (value) {
    this._baseURL = value
  }

  get debugURL () {
    return this._debugURL
  }

  set debugURL (value) {
    this._debugURL = value
  }

  get collectURL () {
    return this._collectURL
  }

  set collectURL (value) {
    this._collectURL = value
  }

  get batchURL () {
    return this._batchURL
  }

  set batchURL (value) {
    this._batchURL = value
  }

  get trackingID () {
    return this._trackingID
  }

  set trackingID (value) {
    this._trackingID = value
  }

  get version () {
    return this._version
  }

  set version (value) {
    this._version = value
  }

  /**
   * Send a "pageview" request
   *
   * @param {string} url Url of the page
   * @param {string} title Title of the page
   * @param {string} hostname Document hostname
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  pageview (hostname, url, title, clientID) {
    const params = { dh: hostname, dp: url, dt: title }
    return this.send('pageview', params, clientID)
  }

  /**
   * Send a "event" request
   *
   * @param {string} evCategory Event category
   * @param {string} evAction Event action
   * @param {string} [clientID]   uuidV4
   * @param {string} evLabel Event label
   * @param {string} evValue Event description
   *
   * @return {Promise}
   */
  event (evCategory, evAction, { evLabel, evValue, clientID } = {}) {
    let params = { ec: evCategory, ea: evAction }

    if (evLabel) params[ 'el' ] = evLabel
    if (evValue) params[ 'ev' ] = evValue

    return this.send('event', params, clientID)
  }

  /**
   * Send a "screenview" request
   *
   * @param {string} appName App name
   * @param {string} appVer App version
   * @param {string} appID App Id
   * @param {string} appInstallerID App Installer Id
   * @param {string} screenName Screen name / Content description
   * @param {string} [clientID]       uuidV4
   *
   * @return {Promise}
   */
  screen (appName, appVer, appID, appInstallerID, screenName, clientID) {
    const params = {
      an: appName,
      av: appVer,
      aid: appID,
      aiid: appInstallerID,
      cd: screenName
    }

    return this.send('screenview', params, clientID)
  }

  /**
   * Send a "transaction" request
   *
   * @param {string} trnID Transaction ID
   * @param {string} trnAffil Transaction affiliation
   * @param {string} trnRev Transaction Revenue
   * @param {Number} trnShip Transaction shipping
   * @param {Number} trnTax Transaction tax
   * @param {string} currCode Currency code
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  transaction (trnID, { trnAffil, trnRev, trnShip, trnTax, currCode } = {}, clientID) {
    let params = { ti: trnID }

    if (trnAffil) params[ 'ta' ] = trnAffil
    if (trnRev) params[ 'tr' ] = trnRev
    if (trnShip) params[ 'ts' ] = trnShip
    if (trnTax) params[ 'tt' ] = trnTax
    if (currCode) params[ 'cu' ] = currCode

    return this.send('transaction', params, clientID)
  }

  /**
   * Send a "social" request
   *
   * @param {string} socialAction Social Action
   * @param {string} socialNetwork Social Network
   * @param {string} socialTarget Social Target
   * @param {string} [clientID]      uuidV4
   *
   * @return {Promise}
   */
  social (socialAction, socialNetwork, socialTarget, clientID) {
    const params = {
      sa: socialAction,
      sn: socialNetwork,
      st: socialTarget
    }

    return this.send('social', params, clientID)
  }

  /**
   * Send a "exception" request
   *
   * @param {string} exDesc Exception description
   * @param {Number} exFatal Exception is fatal?
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  exception (exDesc, exFatal, clientID) {
    const params = { exd: exDesc, exf: exFatal }

    return this.send('exception', params, clientID)
  }

  /**
   * Send a "refund" request
   *
   * @param {string} transactionID Transaction ID
   * @param {string} evCategory Event category
   * @param {string} evAction Event action
   * @param {Number} nonInteraction Non-interaction parameter
   * @param {string} [clientID]       uuidV4
   *
   * @returns {Promise}
   */
  refund (transactionID, evCategory = 'Ecommerce', evAction = 'Refund', nonInteraction = 1, clientID) {
    const params = {
      ec: evCategory,
      ea: evAction,
      ni: nonInteraction,
      ti: transactionID,
      pa: 'refund'
    }

    return this.send('event', params, clientID)
  }

  /**
   * Send a request to google-analytics
   *
   * @param {string} hitType Hit type
   * @param {Object} params Options
   * @param {string} [clientID] Unique identifier (uuidV4)
   *
   * @return {Promise}
   */
  send (hitType, params, clientID) {
    let formObj = {
      v: this._version,
      tid: this._trackingID,
      cid: clientID || uuidV4(),
      t: hitType
    }
    if (params) Object.assign(formObj, params)

    let url = `${this._baseURL}${this._collectURL}`
    if (this._debug) {
      url = `${this._baseURL}${this._debugURL}${this._collectURL}`
    }

    let reqObj = {
      url: url,
      method: 'POST',
      body: Object.keys(formObj)
        .map(key => `${encodeURI(key)}=${encodeURI(formObj[ key ])}`)
        .join('&')
    }
    if (this._userAgent !== '') {
      reqObj.headers = { 'User-Agent': this._userAgent }
    }

    return fetch(url, reqObj)
      .then(res => {
        if (res.headers.get('content-type') !== 'image/gif') {
          return res.json()
            .catch(() => res.text()
              .then(text => { throw new AnalyticsError('Analytics server responded with an error: ' + text) })
            )
            .then(bodyJson => {
              if (res.ok) {
                if (this._debug) {
                  if (bodyJson.hitParsingResult[ 0 ].valid) {
                    return { clientID: formObj.cid }
                  }
                  // Debug mode is true, so print out the error
                  console.log(JSON.stringify(bodyJson, null, 2))
                  throw new AnalyticsError('Analytics server responded with an error', bodyJson)
                }
                return { clientID: formObj.cid }
              } else {
                throw new AnalyticsError('Analytics server responded with an error', bodyJson)
              }
            })
        } else {
          return res.text()
            .then(text => { throw new AnalyticsError('Analytics server responded with an error: ' + text) })
        }
      })
  }
}
