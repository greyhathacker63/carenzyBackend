const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const morgan = require('morgan');
const HttpStatus = require('http-status-codes');
const Response = require('../utilities/Response');
const router = require('../api');

module.exports = ({ app }) => {
	/*
    |--------------------------------------------------------------------------
    | Heroku, Bluemix, AWS ELB, Nginx, etc
    |--------------------------------------------------------------------------
	|
    | Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	| It shows the real origin IP in the heroku or Cloudwatch logs
    |
    */
	app.enable('trust proxy');

	// HTTP request logger
	app.use(morgan('dev'));

	// The magic package that prevents frontend developers going nuts
	// Alternate description:
	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors({origin: '*'}));

	// Some sauce that always add since 2014
	// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
	// Maybe not needed anymore ?
	app.use(methodOverride());

	// Middleware that transforms the raw string of req.body into json
	app.use(bodyParser.json({limit: '100mb', type: 'application/json'}));

	// Load API routes
	router(app);

	// catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err = Error(`Route ${req.url} Not Found`);
		err.status = HttpStatus.StatusCodes.NOT_FOUND;
		next(err);
	});

	// error handlers
	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		/*
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === 'UnauthorizedError') {
			return Response.fail(res, err.message, err.status);
		}

		/*
		 * Handle multer error
		 */
		if (err.name === 'MulterError') {
			return Response.fail(res, err.message, HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
		}

		return Response.fail(res, err.message, err.code || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
	});
	app.use((err, req, res) => {
		res.status(err.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
		res.json({
			errors: {
				message: err.message,
			},
		});
	});
};