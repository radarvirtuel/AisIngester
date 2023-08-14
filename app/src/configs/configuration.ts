export const configuration = () => ({
  // Mongoose access
  mongoUrl: process.env.DATABASE_URL_MONGO,

  // Api
  production: false,
  apiPrefix: 'api', // general prefix for nestjs routes
  port: 3000, // nestjs port

  // Ingester Validator
  ingesterMaxDistance: 1500,

  // Access Logger
  accessLoggerFileSize: '10M', // the max size of the file before it rotates
  accessLoggerFileInterval: '1d', // the max time before it rotates

  // Helmet
  helmetContentSecurityPolicy: false, // false for sk build

  // Cors
  corsOrigins: ['http://localhost:3000'], // allowed origins | Ex: angular

  // OpenAPI
  openAPIPath: 'api', // path of the open api docs
  openAPITitle: 'Ais Ingester Doc', // title of the open api docs
  openAPIDescription: 'Api used to process data sent from ais stations', // description of the open api docs
  openAPIVersion: '1.0', // version of the open api docs

  // Session
  sessionSecret: 'changeMeOrInsecure', // ! you need to change this
  sessionCookieMaxAge: 86400000, // value in ms | 1 day
  sessionResave: false, // true = Forces the session to be saved back to the session store, even if the session was never modified during the request.
  sessionSaveUninitialized: false, // true = Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
  sessionCookieHttpOnly: false, // Specifies the boolean value for the HttpOnly Set-Cookie attribute.
  sessionCookieSecure: 'auto', // Specifies the boolean value for the Secure Set-Cookie attribute.

  // Mailer
  mailerSmtpHost: 'smtp.example.com', // Smtp Host
  mailerSmtpPort: 25, // Smtp Port
  mailerDefaultFrom: '"skulljs" <skulljs@example.com>', // Default from for mails
  mailerDevEnvRedirectEmail: 'redirect@example.com', // Email address for mail diversion in dev env

  // Crypto
  cryptoSecretKey: 'changeMeOrInsecure'.padEnd(32, '!'), // ! you need to change this, === 32 characters
  cryptoHashSaltString: 'changeMeOrInsecure', // ! you need to change this
});
