const _ = require('lodash');
const winston = require('winston');
require('winston-daily-rotate-file');
const Config = require('../config');


let LoggerInstance = null;

const stringifyProperties = info => {
	const skip = ['message', 'timestamp', 'level'];
	let response = '';

	for (const key in info) {
		if (Object.prototype.hasOwnProperty.call(info, key)) {
			const value = info[key];
			if (!skip.includes(key) && value) {
				response += `${key}=${value}`;
			}
		}
	}

	return response;
};

class Logger {
	static init({ transports = [], level = 'info', defaultMeta = {} } = {}) {
		if (!_.isArray(transports)) {
			throw new Error('transports is not an array');
		}

		if (!Object.keys(winston.config.npm.levels).includes(level)) {
			throw new Error('invalid level');
		}

		if (!_.isObject(defaultMeta) || _.isArray(defaultMeta)) {
			throw new Error('invalid default meta');
		}

		if (_.isEmpty(transports)) {
			if (false && Config.IsLocal) {
				transports.push(
					new winston.transports.Console({
						format: winston.format.combine(winston.format.cli(), winston.format.simple()),
					}),
				);
			} else {
				const fileTransport = new winston.transports.DailyRotateFile({
					filename: `${Config.logDir}/app.%DATE%.log`,
					datePattern: 'YYYY-MM-DD-HH',
					zippedArchive: true,
					handleExceptions: true,
					json: true,
					maxSize: '20m',
					maxFiles: '15d',
					format: winston.format.json(),
				});
				transports.push(
					// new winston.transports.Console({ format: winston.format.json() }), 
					fileTransport
				);
			}
		}

		const loggerlevels = {
			fatal: 0,
			alert: 1,
			error: 2,
			warning: 3,
			info: 4,
			debug: 5,
			trace: 6,
		};
		LoggerInstance = winston.createLogger({
			level: level || 'info',
			levels: loggerlevels,
			format: winston.format.combine(
				winston.format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
					alias: '@timestamp',
				}),
				winston.format.errors({ stack: true }),
				winston.format.splat(),
				winston.format.json(),
				winston.format.printf(
					info => `@ ${info.timestamp} - ${info.level}: ${info.message} ${stringifyProperties(info)}`,
				),
			),
			transports,
			defaultMeta,
		});
	}

	static log(level, message, meta = {}) {
		if (!_.isObject(meta)) {
			meta = { meta };
		} else if (meta.message) {
			message += ' ';
		}

		LoggerInstance.log(level, message, meta);
	}

	static info(message, meta = {}) {
		Logger.log('info', message, meta);
	}

	static error(message, meta = {}) {
		Logger.log('error', message, meta);
	}
}

module.exports = Logger