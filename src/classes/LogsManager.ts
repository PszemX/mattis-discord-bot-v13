/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import { format } from 'date-fns';
import winston from 'winston';
import { ILoggerOptions } from '../typings';

enum Colors {
	Reset = '\x1b[0m',
	Red = '\x1b[31m',
	Yellow = '\x1b[33m',
	Green = '\x1b[32m',
	Blue = '\x1b[34m',
}

export class LogsManager {
	public constructor(public readonly options: ILoggerOptions) {}

	public info(...messages: any[]): void {
		this.log(messages, 'info');
	}

	public debug(...messages: any[]): void {
		this.log(messages, 'debug');
	}

	public error(...messages: any[]): void {
		this.log(messages, 'error');
	}

	public warn(...messages: any[]): void {
		this.log(messages, 'warn');
	}

	private log(
		messages: any[],
		level: 'info' | 'debug' | 'error' | 'warn' = 'info'
	): void {
		if (this.options.prod && level === 'debug') return;

		console[level](
			`${
				this.options.prod
					? ''
					: level === 'debug'
					? Colors.Blue
					: level === 'error'
					? Colors.Red
					: level === 'warn'
					? Colors.Yellow
					: Colors.Green
			}╠ [${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}] [${level}]: ${messages
				.map((x) => String(x))
				.join(' ')} ${Colors.Reset}`
		);
	}
}

export function createLogger(
	serviceName: string,
	prod = false
): winston.Logger {
	const logger = winston.createLogger({
		defaultMeta: {
			serviceName,
		},
		format: winston.format.combine(
			winston.format.printf((info) => {
				const { level, message, stack } = info;
				const prefix = `[${format(
					Date.now(),
					'yyyy-MM-dd HH:mm:ss'
				)}] [${level}]`;
				if (['error', 'crit'].includes(level)) return `${prefix}: ${stack}`;
				return `${prefix}: ${message}`;
			})
		),
		level: prod ? 'info' : 'debug',
		levels: {
			alert: 1,
			debug: 5,
			error: 0,
			info: 4,
			notice: 3,
			warn: 2,
		},
		transports: [
			new winston.transports.File({
				filename: `logs/${serviceName}/error-${format(
					Date.now(),
					'yyyy-MM-dd-HH-mm-ss'
				)}.log`,
				level: 'error',
			}),
			new winston.transports.File({
				filename: `logs/${serviceName}/logs-${format(
					Date.now(),
					'yyyy-MM-dd-HH-mm-ss'
				)}.log`,
			}),
		],
	});
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.printf((info) => {
					const { level, message, stack } = info;
					const prefix = `╠ [${format(
						Date.now(),
						'yyyy-MM-dd HH:mm:ss'
					)}] [${level}]`;
					if (['error', 'alert'].includes(level) && !prod) {
						return `${prefix}: ${stack}`;
					}
					return `${prefix}: ${message}`;
				}),
				winston.format.align(),
				prod
					? winston.format.colorize({ all: false })
					: winston.format.colorize({ all: true })
			),
		})
	);
	return logger;
}
