const config = {
  IsLocal: process.env.NODE_ENV === 'local',
  IsProd: process.env.NODE_ENV === 'prod',

  port: parseInt(process.env.PORT, 10) || 3000,
  dbConnectionUrl: process.env.DB_CONNECTION_URL,
  uploadServerIp: process.env.UPLOAD_SERVER_IP_ADD,
  appBaseUrl:
    process.env.NODE_ENV !== 'prod'
      ? `http://localhost:${parseInt(process.env.PORT, 10) || 3000}`
      : `${process.env.SERVER_IP_ADD}:${parseInt(process.env.PORT, 10) || 3000}`,

  localUploadBaseUrl: function () {
    return `${process.env.LOCAL_UPLOAD_SERVER_IP_ADD}`;
  },
  otpLoginExpDuration: 100000000,
  database: {
    host: process.env.DB_HOSTNAME,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  jwt: {
    expDuration: process.env.JWT_TIME,
    secretKey: process.env.JWT_SECREATE_kEY
  },
  crypto: {
    algorithm: 'aes-256-ctr',
    encryptionKey: Buffer.from('FoCKvdLslUuB2x3EZlKate7XGottHski1LmyqJHvUht=', 'base64'),
    ivLength: 16
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  TempFileDir: `${__dirname}/../../${process.env.TEMP_UPLOAD_DIR}`,
  logDir: process.env.LOG_DIR,

  WebUrl: process.env.WEB_URL || null,
  awss3:{
    region: process.env.AWS_S3_REGION || "ap-south-1",
    accessKey: process.env.AWS_S3_ACCESSKEY,
    secretKey: process.env.AWS_S3_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    uploadDirName: process.env.AWS_S3_UPLOAD_DIR_NAME || ""
  },
  smsApi: {
    url: process.env.SMS_API_URL,
    apikey: process.env.SMS_API_KEY,
    senderId: process.env.SMS_SENDER_ID
  },
  phonePe: {
    merchantId: process.env.PHONEPE_MERCHANTID,
    saltKey: process.env.PHONEPE_SALTKEY,
    baseUrl: process.env.PHONEPE_BASEURL,
    redirectUrl: process.env.PHONEPE_REDIRECT_URL,
    failedUrl: process.env.PHONEPE_PAYMENT_FAILED_URL,
    callbackUrl: process.env.PHONEPE_CALLBACK_URL,
    saltKeyIndex: process.env.PHONEPE_SALTINDEX,
    redirectUrl: process.env.PHONEPE_WEBSITE_REDIRECT_URL,
  }
};

module.exports = config;