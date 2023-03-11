// Include the dependencies
const mysql = require('mysql');
const mysql2 = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');
const nodemailer = require('nodemailer');
const uuidv1 = require('uuid/v1');
const cookieParser = require('cookie-parser');
const cryptography = require('crypto');
const fs = require('fs');
const fetch = require('node-fetch');
const { Console } = require('console');
const http = require('http');
// const socketio = require('socket.io');
const url = require('url');
// Initialize express and socket.io
// const app = express()
// const server = require('http').Server(app)
// const { instrument } = require("@socket.io/admin-ui");
// const io = require('socket.io')(2999, {
// 	cors: {
// 		origin: ["http://localhost:3000/", "https:/n/admin.socket.io"]
// 	},
// })
// instrument(io, {
// 	auth: false
// });
//Initialize express and socket.io Old method
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const fileUpload = require('express-fileupload');

// const { Server } = require('socket.io');
// const server2 = http.createServer(app);
// const io = new Server(server2);

let joindata = [];
let createRoomData = [];

const formatMessage = require('./utils/messages');

const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	getActiveUsers,
	getActiveRoom
} = require('./utils/users');

var activeRooms = [];

// Unique secret key
const secret_key = 'your secret key';
// Update the below details with your own MySQL connection details

// Local Connection
var connection = mysql.createConnection({
	host: 'localhost',
	// port: 3306,
	user: 'root',
	password: '',//,password: 'root',
	database: 'nodelogin',
	multipleStatements: true,
	bigNumberStrings: true,
});

// Remote connection
// var connection = mysql2.createConnection({
// 	// host: '34.136.59.230:3306',
// 	host: '72.14.183.70',
// 	port: 3306,
// 	user: 'remoteiota',
// 	password: 'Password!*',//,password: 'root',
// 	database: 'nodelogin',
// 	multipleStatements: true,
// 	bigNumberStrings: true,
// });

//Doesn't work
// var connection3 = mysql.createConnection({
// 	// host: '34.136.59.230:3306',
// 	host: '139.144.34.246',
// 	port: 3306,
// 	user: 'remote_user',
// 	password: 'Password!*',//,password: 'root',
// 	database: 'IOTA',
// 	// multipleStatements: true,
// 	// bigNumberStrings: true,
// });


// Mail settings: Update the username and passowrd below to your email and pass, the current mail host is set to gmail, but you can change that if you want.
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'xxxxxx@xxxxxx.xxx',
		pass: 'xxxxxx'
	}
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//botUsername
const botName = 'BOT';

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Configure nunjucks template engine
const env = nunjucks.configure('viewsNunjucks', {
	autoescape: true,
	express: app
});

env.addFilter('formatNumber', num => String(num).replace(/(.)(?=(\d{3})+$)/g, '$1,'));
env.addFilter('formatDateTime', date => (new Date(date).toISOString()).slice(0, -1).split('.')[0]);
// Use sessions and other dependencies
app.use(session({
	secret: secret_key,
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());

app.use(
	fileUpload({
		limits: {
			fileSize: 3000000,
		},
		abortOnLimit: true,
	})
);

app.post('/upload', (req, res) => {
	// Get the file that was set to our field named "image"

	var username = req.body.username;
	console.log("Res-body: ", req.body);
	console.log("Res-files: ", req.files);
	if (req.files == null)
		res.redirect('/profile');

	const { image } = req.files;

	// If no image submitte/uploadd, exit
	if (!image) return res.sendStatus(400);

	// If does not have image mime type prevent from uploading
	// if (/^image/.test(image.mimetype)) return res.sendStatus(400);

	if (!(image.name.includes(".png") || image.name.includes(".gif") || image.name.includes("jpg")))
		// return res.sendStatus(400);
		res.redirect('/profile');

	var ext;
	if (image.name.includes(".png")) {
		ext = ".png";
		removeProfilePic('./public/upload/' + "-" + username + "-" + "profilePic" + ".gif");
		removeProfilePic('./public/upload/' + "-" + username + "-" + "profilePic" + ".jpg");
	} if (image.name.includes(".jpg")) {
		ext = ".jpg";
		removeProfilePic('./public/upload/' + "-" + username + "-" + "profilePic" + ".png");
		removeProfilePic('./public/upload/' + "-" + username + "-" + "profilePic" + ".gif");
	} if (image.name.includes(".gif")) {
		ext = ".gif";
		removeProfilePic('./public/upload/' + "-" + username + "-" + "profilePic" + ".png");
		removeProfilePic('./public/upload/' + "-" + username + "-" + "profilePic" + ".jpg");
	}

	let pfpLink = '../upload/' + "-" + username + "-" + "profilePic" + ext;

	// Move the uploaded image to our upload folder
	image.mv(__dirname + '/public/upload/' + "-" + username + "-" + "profilePic" + ext);

	connection.query('UPDATE userstats SET profilePic = ? WHERE username = ?', [pfpLink, username]);




	// All good
	// res.sendStatus(200);
	// delay(100)
	res.redirect('/profile');
});

// const dirPath = "./public/upload/"
function removeProfilePic(file) {
	// fs.unlinkSync(file);
	fs.unlink(file, function (err) {
		if (err && err.code == 'ENOENT') {
			// file doens't exist
			console.info("File doesn't exist, won't remove it.");
		} else if (err) {
			// other errors, e.g. maybe we don't have enough permission
			console.error("Error occurred while trying to remove file");
		} else {
			console.info(`removed`);
		}
	});
}

// http://localhost:3000/ - display login page 
app.get(['/', '/login'], (request, response) => isLoggedin(request, () => {
	// User is logged in, redirect to home page
	response.redirect('/home');
}, () => {
	// Create CSRF token
	let token = cryptography.randomBytes(20).toString('hex');
	// Store token in session
	request.session.token = token;
	// User is not logged in, render login template
	response.render('index.html', { token: token, msg: "" });
}));

// http://localhost:3000/ - authenticate the user
app.post(['/', '/login'], (request, response) => init(request, settings => {
	// Create variables and assign the post data
	let username = request.body.username;
	let password = request.body.password;
	let hashedPassword = cryptography.createHash('sha1').update(request.body.password).digest('hex');
	let token = request.body.token;
	// Get client IP address
	let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
	// Bruteforce protection
	if (settings['brute_force_protection'] == 'true') {
		loginAttempts(ip, false, result => {
			if (result && result['attempts_left'] <= 1) {
				// No login attempts remaining
				response.send('You cannot login right now! Please try again later!');
				return response.end();
			}
		});
	}
	// check if the data exists and is not empty
	if (username && password) {
		// Ensure the captured token matches the session token (CSRF Protection)
		if (settings['csrf_protection'] == 'true' && token != request.session.token) {
			// Incorrect token
			response.send('Incorrect token provided!');
			response.render('index.html', { token: null, msg: "Incorrect token provided!" });
			return response.end();
		}
		// Select the account from the accounts table
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, hashedPassword], (error, accounts) => {
			// If the account exists
			if (accounts.length > 0) {
				// Twofactor
				if (settings['twofactor_protection'] == 'true' && accounts[0].ip != ip) {
					request.session.tfa_id = accounts[0].id;
					request.session.tfa_email = accounts[0].email;
					response.send('tfa: twofactor');
					return response.end();
				}
				// Make sure account is activated
				if (settings['account_activation'] == 'true' && accounts[0].activation_code != 'activated' && accounts[0].activation_code != '') {
					response.send('Please activate your account to login!');
					return response.end();
				}
				// Account exists (username and password match)
				// Create session variables
				request.session.account_loggedin = true;
				request.session.account_id = accounts[0].id;
				request.session.account_username = accounts[0].username;
				request.session.account_password = accounts[0].password;
				request.session.account_role = accounts[0].role;
				// If user selected the remember me option
				if (request.body.rememberme) {
					// Create cookie hash, will be used to check if user is logged in
					let hash = accounts[0].rememberme ? accounts[0].rememberme : cryptography.createHash('sha1').update(username + password + secret_key).digest('hex');
					// Num days until the cookie expires (user will log out)
					let days = 90;
					// Set the cookie
					response.cookie('rememberme', hash, { maxAge: 1000 * 60 * 60 * 24 * days, httpOnly: true });
					// Update code in database
					connection.query('UPDATE accounts SET rememberme = ? WHERE username = ?', [hash, username]);
				}
				// Delete login attempts
				connection.query('DELETE FROM login_attempts WHERE ip_address = ?', [ip]);
				// Output success and redirect to home page
				response.redirect('/home'); // do not change the message as the ajax code depends on it
				//response.send('<a href="/home">Home</a>');
				return response.end();
			} else {
				// Bruteforce
				if (settings['brute_force_protection'] == 'true') loginAttempts(ip);
				// Incorrect username/password
				// response.send('Incorrect Username and/or Password!');
				response.render('index.html', { token: null, msg: "Incorrect Username and/or Password!" });
				// return response.end();
			}
		});
	} else {
		// Bruteforce
		if (settings['brute_force_protection'] == 'true') loginAttempts(ip);
		// Incorrect username/password
		// response.send('Incorrect Username and/or Password!');
		response.render('index.html', { token: null, msg: "Incorrect Username and/or Password!" });
		// return response.end();
	}
}));

// http://localhost:3000/register - display the registration page
app.get('/register', (request, response) => isLoggedin(request, () => {
	// User is logged in, redirect to home page
	response.redirect('/home');
}, (settings) => {
	// Create CSRF token
	let token = cryptography.randomBytes(20).toString('hex');
	// Store token in session
	request.session.token = token;
	// User is not logged in, render login template
	response.render('register.html', { token: token, settings: settings });
}));

// http://localhost:3000/register - register user
app.post('/register', (request, response) => init(request, settings => {
	// Create variables and assign the POST data
	let username = request.body.username;
	let password = request.body.password;
	let cpassword = request.body.cpassword;
	let hashedPassword = cryptography.createHash('sha1').update(request.body.password).digest('hex');
	let email = request.body.email;
	let token = request.body.token;
	// Get client IP address
	let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
	// Default role
	let role = 'Member';
	// Ensure the captured token matches the session token (CSRF Protection)
	if (settings['csrf_protection'] == 'true' && token != request.session.token) {
		// Incorrect token
		response.send('Incorrect token provided!');
		return response.end();
	}
	// Validate captcha if enabled
	if (settings['recaptcha'] == 'true') {
		if (!request.body['g-recaptcha-response']) {
			response.send('Invalid captcha!');
			return response.end();
		} else {
			fetch('https://www.google.com/recaptcha/api/siteverify?response=' + request.body['g-recaptcha-response'] + '&secret=' + settings['recaptcha_secret_key']).then(res => res.json()).then(body => {
				if (body.success !== undefined && !body.success) {
					response.send('Invalid captcha!');
					return response.end();
				}
			});
		}
	}
	// Check if the POST data exists and not empty
	if (username && password && email) {
		// Check if account exists already in the accounts table based on the username or email
		connection.query('SELECT * FROM accounts WHERE username = ? OR email = ?', [username, email], (error, accounts, fields) => {
			// Check if account exists and validate input data
			if (accounts.length > 0) {
				response.send('Account already exists with that username and/or email!');
				response.end();
			} else if (!/\S+@\S+\.\S+/.test(email)) {
				response.send('Invalid email address!');
				response.end();
			} else if (!/[A-Za-z0-9]+/.test(username)) {
				response.send('Username must contain only characters and numbers!');
				response.end();
			} else if (password != cpassword) {
				response.send('Passwords do not match!');
				response.end();
			} else if (username.length < 5 || username.length > 20) {
				response.send('Username must be between 5 and 20 characters long!');
				response.end();
			} else if (password.length < 5 || password.length > 20) {
				response.send('Password must be between 5 and 20 characters long!');
				response.end();
			} else if (settings['account_activation'] == 'true') {
				// Generate a random unique ID
				let activationCode = uuidv1();
				// Change the below domain to your domain
				let activateLink = request.protocol + '://' + request.get('host') + '/activate/' + email + '/' + activationCode;
				// Get the activation email template
				let activationTemplate = fs.readFileSync(path.join(__dirname, 'views/activation-email-template.html'), 'utf8').replaceAll('%link%', activateLink);
				// Change the below mail options
				let mailOptions = {
					from: settings['mail_from'], // "Your Name / Business name" <xxxxxx@gmail.com>
					to: email,
					subject: 'Account Activation Required',
					text: activationTemplate.replace(/<\/?[^>]+(>|$)/g, ''),
					html: activationTemplate
				};
				// Insert account with activation code
				connection.query('INSERT INTO accounts (username, password, email, activation_code, role, ip) VALUES (?, ?, ?, ?, ?, ?)', [username, hashedPassword, email, activationCode, role, ip], () => {
					// Send activation email
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message %s sent: %s', info.messageId, info.response);
					});
					response.send('Please check your email to activate your account!');
					response.end();
				});
			} else {
				// Insert account
				connection.query('INSERT INTO accounts (username, password, email, activation_code, role, ip) VALUES (?, ?, ?, "activated", ?, ?)', [username, hashedPassword, email, role, ip], (error, result) => {
					connection.query('INSERT INTO userstats (username, role, coins, xp, friends, roomConfig, blockedUsers, followers) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [username, role, 100, 10, "[]", "[]", "[]", "[]"], (error, results) => {
						console.log("UserStat results: ", results);
						console.log("UserStat errors: ", error);
					})
					// Registration success!
					if (settings['auto_login_after_register'] == 'true') {
						// Authenticate the user
						request.session.account_loggedin = true;
						request.session.account_id = result.insertId;
						request.session.account_username = username;
						request.session.account_password = hashedPassword;
						request.session.account_role = role;
						response.send('autologin');
						response.end();
					} else {
						response.send('You have registered! You can now login!');
						response.end();
					}
				});
			}
		});
	} else {
		// Form is not complete...
		response.send('Please complete the registration form!');
		response.end();
	}
}));

// http://localhost:3000/activate/<email>/<code> - activate an account
app.get('/activate/:email/:code', (request, response) => {
	// Check if the email and activation code match in the database
	connection.query('SELECT * FROM accounts WHERE email = ? AND activation_code = ?', [request.params.email, request.params.code], (error, accounts) => {
		// If email and code are valid
		if (accounts.length > 0) {
			// Email and activation exist, update the activation code to "activated"
			coredirectnnection.query('UPDATE accounts SET activation_code = "activated" WHERE email = ? AND activation_code = ?', [request.params.email, request.params.code], () => {
				// Authenticate the user
				request.session.account_loggedin = true;
				request.session.account_id = accounts[0].id;
				request.session.account_username = accounts[0].username;
				request.session.account_password = accounts[0].password;
				request.session.account_role = accounts[0].role;
				// Reditect to home page
				response.redirect('/home');
			});
		} else {
			// Render activate template and output message
			response.render('activate.html', { msg: 'Incorrect email and/or activation code!' });
		}
	});
});

// http://localhost:3000/forgotpassword - user can use this page if they have forgotten their password
app.get('/forgotpassword', (request, response) => {
	// Render forgot password template and output message
	response.render('forgotpassword.html');
});

// http://localhost:3000/forgotpassword - update account details
app.post('/forgotpassword', (request, response) => init(request, settings => {
	// Render activate template and output message
	if (request.body.email) {
		// Retrieve account info from database that's associated with the captured email
		connection.query('SELECT * FROM accounts WHERE email = ?', [request.body.email], (error, accounts) => {
			// If account exists
			if (accounts.length > 0) {
				// Generate a random unique ID
				let resetCode = uuidv1();
				// Change the below domain to your domain
				let resetLink = request.protocol + '://' + request.get('host') + '/resetpassword/' + request.body.email + '/' + resetCode;
				console.log(resetLink);
				// Change the below mail options
				let mailOptions = {
					from: settings['mail_from'], // "Your Name / Business name" <xxxxxx@gmail.com>
					to: request.body.email,
					subject: 'Password Reset',
					text: 'Please click the following link to reset your password: ' + resetLink,
					html: '<p>Please click the following link to reset your password: <a href="' + resetLink + '">' + resetLink + '</a></p>'
				};
				// Update reset column in db
				connection.query('UPDATE accounts SET reset = ? WHERE email = ?', [resetCode, request.body.email]);
				// Send reset password email
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					console.log('Message %s sent: %s', info.messageId, info.response);
				});
				// Render forgot password template
				response.render('forgotpassword.html', { msg: 'Reset password link has been sent to your email!' });
			} else {
				// Render forgot password template
				response.render('forgotpassword.html', { msg: 'An account with that email does not exist!' });
			}
		});
	}
}));

// http://localhost:3000/resetpassword - display the reset form
app.get('/resetpassword/:email/:code', (request, response) => {
	// Make sure the params are specified
	if (request.params.email && request.params.code) {
		// Retrieve account info from database that's associated with the captured email
		connection.query('SELECT * FROM accounts WHERE email = ? AND reset = ?', [request.params.email, request.params.code], (error, accounts) => {
			// Check if account exists
			if (accounts.length > 0) {
				// Render forgot password template
				response.render('resetpassword.html', { email: request.params.email, code: request.params.code });
			} else {
				response.send('Incorrect email and/or code provided!');
				response.end();
			}
		});
	} else {
		response.send('No email and/or code provided!');
		response.end();
	}
});

// http://localhost:3000/resetpassword - update password
app.post('/resetpassword/:email/:code', (request, response) => {
	// Make sure the params are specified
	if (request.params.email && request.params.code) {
		// Retrieve account info from database that's associated with the captured email
		connection.query('SELECT * FROM accounts WHERE email = ? AND reset = ?', [request.params.email, request.params.code], (error, accounts) => {
			// Check if account exists
			if (accounts.length > 0) {
				// Output msg
				let msg = '';
				// Check if user submitted the form
				if (request.body.npassword && request.body.cpassword) {
					// Validation
					if (request.body.npassword != request.body.cpassword) {
						msg = 'Passwords do not match!';
					} else if (request.body.npassword.length < 5 || request.body.npassword.length > 20) {
						msg = 'Password must be between 5 and 20 characters long!';
					} else {
						// Success! Update password
						msg = 'Your password has been reset! You can now <a href="/">login</a>!';
						// Hash password
						let hashedPassword = cryptography.createHash('sha1').update(request.body.npassword).digest('hex');
						// Update password
						connection.query('UPDATE accounts SET password = ?, reset = "" WHERE email = ?', [hashedPassword, request.params.email]);
					}
					// Render reset password template
					response.render('resetpassword.html', { msg: msg, email: request.params.email, code: request.params.code });
				} else {
					msg = 'Password fields must not be empty!';
					// Render reset password template
					response.render('resetpassword.html', { msg: msg, email: request.params.email, code: request.params.code });
				}
			} else {
				response.send('Incorrect email and/or code provided!');
				response.end();
			}
		});
	} else {
		response.send('No email and/or code provided!');
		response.end();
	}
});

// http://localhost:3000/twofactor - twofactor authentication
app.get('/twofactor', (request, response) => init(request, settings => {
	// Check if the tfa session variables are declared
	if (request.session.tfa_id && request.session.tfa_email) {
		// Generate a random unique ID
		let twofactorCode = uuidv1();
		// Get the twofactor email template
		let twofactorTemplate = fs.readFileSync(path.join(__dirname, 'views/twofactor-email-template.html'), 'utf8').replaceAll('%code%', twofactorCode);
		// Change the below mail options
		let mailOptions = {
			from: settings['mail_from'], // "Your Name / Business name" <xxxxxx@gmail.com>
			to: request.session.tfa_email,
			subject: 'Your Access Code',
			text: twofactorTemplate.replace(/<\/?[^>]+(>|$)/g, ''),
			html: twofactorTemplate
		};
		// Update tfa code column in db
		connection.query('UPDATE accounts SET tfa_code = ? WHERE id = ?', [twofactorCode, request.session.tfa_id]);
		// Send tfa email
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message %s sent: %s', info.messageId, info.response);
		});
		// Render twofactor template
		response.render('twofactor.html');
	} else {
		// Redirect to login page
		response.redirect('/');
	}
}));

// http://localhost:3000/twofactor - twofactor authentication
app.post('/twofactor', (request, response) => {
	// Check if the tfa session variables are declared
	if (request.session.tfa_id && request.session.tfa_email) {
		// Retrieve account info from database that's associated with the captured email
		connection.query('SELECT * FROM accounts WHERE id = ? AND email = ?', [request.session.tfa_id, request.session.tfa_email], (error, accounts) => {
			// Output msg
			let msg = '';
			// If accounts not empty
			if (accounts.length > 0) {
				// Check if user submitted the form
				if (request.body.code) {
					// Check if captured code and account code match
					if (request.body.code == accounts[0]['tfa_code']) {
						// Get client IP address
						let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
						// Update IP address in db
						connection.query('UPDATE accounts SET ip = ? WHERE id = ?', [ip, request.session.tfa_id]);
						// Authenticate the user
						request.session.account_loggedin = true;
						request.session.account_id = accounts[0].id;
						request.session.account_username = accounts[0].username;
						request.session.account_password = accounts[0].password;
						request.session.account_role = accounts[0].role;
						// Redirect to home page
						return response.redirect('/home');
					} else {
						msg = 'Incorrect email and/or code!';
					}
				}
			} else {
				msg = 'Incorrect email and/or code!';
			}
			// Render twofactor template
			response.render('twofactor.html', { msg: msg });
		});
	} else {
		// Redirect to login page
		response.redirect('/');
	}
});

// http://localhost:3000/home - display the home page
app.get(['/home'], (request, response) => isLoggedin(request, settings => {

	connection.query("SELECT * FROM rooms", function (err, result) {
		if (err) throw err;
		//console.log("List of rooms: ", result);
		activeRooms = JSON.stringify(result);
		response.render('home.html', { username: request.session.account_username, role: request.session.account_role, rooms: activeRooms });
	});

	// let search = request.query.search;
	// console.log("Search Query: ", search);

}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/profile - display the profile page
app.get('/profile', (request, response) => isLoggedin(request, settings => {
	// Get all the users account details so we can populate them on the profile page
	connection.query('SELECT * FROM accounts WHERE username = ?', [request.session.account_username], (error, accounts, fields) => {
		connection.query('SELECT * FROM userstats WHERE username = ?', [request.session.account_username], (error, userstats, fields) => {
			// Format the registered date
			// console.log("USER-Stats: ", userstats)
			accounts[0].registered = new Date(accounts[0].registered).toISOString().split('T')[0];

			let userLists;
			connection.query('SELECT username FROM userstats', (error, listofusers, fields) => {
				userLists = JSON.stringify(listofusers);

				// console.log("ULs: ", userLists)
			});

			// Render profile page
			response.render('profile.html', { account: accounts[0], stats: userstats, role: request.session.account_role, userList: userLists, username: request.session.account_username });
		})

	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/edit_profile - displat the edit profile page
app.get('/edit_profile', (request, response) => isLoggedin(request, settings => {
	// Get all the users account details so we can populate them on the profile page
	connection.query('SELECT * FROM accounts WHERE username = ?', [request.session.account_username], (error, accounts, fields) => {
		// Format the registered date
		accounts[0].registered = new Date(accounts[0].registered).toISOString().split('T')[0];
		// Render profile page
		response.render('profile-edit.html', { account: accounts[0], role: request.session.account_role });
	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/edit_profile - displat the edit profile page
app.get(['/messages', '/message:id'], (request, response) => isLoggedin(request, settings => {
	// Get all the users account details so we can populate them on the profile page
	const id = request.params.id;
	connection.query('SELECT * FROM accounts WHERE username = ?', [request.session.account_username], (error, accounts, fields) => {
		// Format the registered date
		accounts[0].registered = new Date(accounts[0].registered).toISOString().split('T')[0];
		connection.query('SELECT * FROM userstats WHERE username = ?', [request.session.account_username], (error, messages, fields) => {
			let userLists, followersList, friendLists;
			let msg = messages[0].messages;
			console.log(request.session.account_username + " : Messages : " + msg);
			connection.query('SELECT username FROM userstats', (error, listofusers, fields) => {
				userLists = JSON.stringify(listofusers);
				connection.query('SELECT followers FROM userstats WHERE username = ?', [request.session.account_username], (error, followerslist, fields) => {
					followersList = JSON.stringify(followerslist);
					connection.query('SELECT friends FROM userstats WHERE username = ?', [request.session.account_username], (error, friendofLists, fields) => {
						connection.query('SELECT profilePic FROM userstats', [request.session.account_username], (error, pfpLinks, fields) => {
							friendLists = JSON.stringify(friendofLists);
							let message = JSON.stringify(msg);
							let pfpsLinkz = JSON.stringify(pfpLinks);
							// Render profile page
							response.render('messages.html', {
								account: accounts[0], messagesData: message, role: request.session.account_role, pfps: pfpsLinkz,
								targetUser: id, userList: userLists, followerslist: followersList, friendlists: friendLists
							});
						})

					})
				})
			})
		});
	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/edit_profile - update account details
app.post('/edit_profile', (request, response) => isLoggedin(request, settings => {
	// Create variables for easy access
	let username = request.body.username;
	let password = request.body.password;
	let cpassword = request.body.cpassword;
	let hashedPassword = cryptography.createHash('sha1').update(request.body.password).digest('hex');
	let email = request.body.email;
	let errorMsg = '';
	// Validation
	if (password != cpassword) {
		errorMsg = 'Passwords do not match!';
	} else if (!/\S+@\S+\.\S+/.test(email)) {
		errorMsg = 'Invalid email address!';
	} else if (!/[A-Za-z0-9]+/.test(username)) {
		errorMsg = 'Username must contain only characters and numbers!';
	} else if (password != cpassword) {
		errorMsg = 'Passwords do not match!';
	} else if (username.length < 5 || username.length > 20) {
		errorMsg = 'Username must be between 5 and 20 characters long!';
	} else if (password && password.length < 5 || password.length > 20) {
		errorMsg = 'Password must be between 5 and 20 characters long!';
	} else if (username && email) {
		// Get account details from database
		connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, accounts, fields) => {
			// Does the account require activation
			let requiresActivation = false;
			// Activation code
			let activationCode = 'activated';
			// Update the password
			hashedPassword = !password ? request.session.account_password : hashedPassword;
			// Check if account activation is required
			if (settings['account_activation'] == 'true' && accounts.length > 0 && accounts[0].email != email) {
				// Generate a random unique ID
				activationCode = uuidv1();
				// Change the below domain to your domain
				let activateLink = request.protocol + '://' + request.get('host') + '/activate/' + email + '/' + activationCode;
				// Change the below mail options
				let mailOptions = {
					from: '"Your Name / Business name" <xxxxxx@gmail.com>',
					to: email,
					subject: 'Account Activation Required',
					text: 'Please click the following link to activate your account: ' + activateLink,
					html: '<p>Please click the following link to activate your account: <a href="' + activateLink + '">' + activateLink + '</a></p>'
				};
				requiresActivation = true;
			}
			// Check if username exists
			if (accounts.length > 0 && username != request.session.account_username) {
				// Username exists
				response.render('profile-edit.html', { account: accounts[0], msg: 'Username already exists!', role: request.session.account_role });
			} else {
				// Update account with new details
				connection.query('UPDATE accounts SET username = ?, password = ?, email = ?, activation_code = ? WHERE username = ?', [username, hashedPassword, email, activationCode, 00], () => {
					// Update session with new username
					request.session.account_username = username;
					// Output message
					let msg = 'Account Updated!';
					// Account activation required?
					if (requiresActivation) {
						// Send activation email
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								return console.log(error);
							}
							console.log('Message %s sent: %s', info.messageId, info.response);
						});
						// Update msg
						msg = 'You have changed your email address! You need to re-activate your account! You will be automatically logged-out.';
						// Destroy session data
						request.session.destroy();
					}
					// Get account details from database
					connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, accounts, fields) => {
						// Render edit profile page
						response.render('profile-edit.html', { account: accounts[0], msg: msg, role: request.session.account_role });
					});
				});
			}
		});
	}
	// Output error message if any
	if (errorMsg) {
		// Get account details from database
		connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, accounts, fields) => {
			// Render edit profile page
			response.render('profile-edit.html', { account: accounts[0], msg: errorMsg, role: request.session.account_role });
		});
	}
}));

app.get(['/joinRoom'], (request, response) => {
	let data = request.query.data;
	console.log("the data:", data)
	console.log("The Request data:", joindata[data])
	console.log("rendering layout")
	// response.render('chat.html')
	let room = joindata[data];
	console.log("room Info: ", room.roomID);
	connection.query("SELECT * FROM rooms WHERE roomID = ?", [room.roomID], function (err, finalresult) {
		if (err) throw err;

		console.log("ln:(723) Joined Room Info: ", finalresult);
		if (room.passcode == finalresult[0]["passcode"]) {
			connection.query("SELECT * FROM userstats WHERE username = ?", [room.userID], function (err, userStatsResult) {
				if (err) throw err;
				var userStats = JSON.stringify(userStatsResult);
				console.log("Correct Passcode.")
				response.render('modal.html', { roomObj: finalresult, roomOBJ: JSON.stringify(finalresult), userJSON: JSON.stringify(userStatsResult), userOBJ: userStatsResult });
			})
		} else {
			console.log("Wrong Passcode.")
		}

	})
});

//delete this
// app.get(['/chat'], (request, response) => {
// 	response.render('room.html', { roomObj: newRoom, roomOBJ: JSON.stringify(newRoom), userJSON: JSON.stringify(userStatsResult), userOBJ: userStatsResult });
// })

app.get(['/createRoom'], (request, response) => {
	let data = request.query.data;
	console.log("the created data:", data)
	console.log("The Request data:", createRoomData[data])
	let room = createRoomData[data];

	room.private = (room.private == "on");

	let userStatsResult;
	let newRoom;
	if (room.private)
		room.private = 1;
	else
		room.private = 0;

	connection.query("SELECT * FROM userstats WHERE username = ?", [room.host], function (err, userStatsResults) {
		if (err) throw err;
		userStatsResult = userStatsResults;
		let users = room.host.split(",");
		let teams = room.teams.toString();
		console.log("Teams:", teams)
		let tags = room.tags.toString();

		connection.query('INSERT INTO rooms (roomID, host, users, passcode, topic, teams, private, watchCost, joinCost, tags, time) VALUES (?,?,?,?,?,?,?,?,?,?, ?)',
			[room.roomID, room.host, users, room.passcode, room.topic, teams, room.private, room.watchCost, room.joinCost, tags, room.time], function (err, finalresult) {
				if (err) {
					// failed to create room
					response.redirect('/');
					//  throw err;
				} else {
					console.log("room Query Info: ", finalresult);
					connection.query('UPDATE userstats SET roomConfig = ? WHERE username = ?', [JSON.stringify(room), room.host]);

					console.log("fetched usersname: ", room.host);

					connection.query("SELECT * FROM rooms WHERE roomID = ?", [room.roomID], function (err, finalresult) {
						if (err) throw err;
						newRoom = finalresult;
						console.log("New room Info: ", newRoom);
						response.render('modal.html', { roomObj: newRoom, roomOBJ: JSON.stringify(newRoom), userJSON: JSON.stringify(userStatsResult), userOBJ: userStatsResult });
					});
				}

			});
	})
});

// http://localhost:3000/modal - going to the Modal page where the team and user name is choosen
app.post(['/modal', '/modal:id'], (request, response) => isLoggedin(request, settings => {
	// console.log("Modal Resp:", request.body);
	const id = request.params.id;
	let room = request.body;

	console.log("Room ID: ", room);
	connection.query("SELECT * FROM rooms WHERE roomID = ?", [room.roomID], function (err, finalresult) {
		if (err) throw err;
		// activeRoom = JSON.stringify(finalresult);
		console.log("Ln:[787] Joined Room Info: ", finalresult);
		// Render room templateconsole.log("Post rooms.SQL: ", result);

		connection.query("SELECT * FROM userstats WHERE username = ?", [request.session.account_username], function (err, userStatsResult) {
			if (err) throw err;
			userStats = JSON.stringify(userStatsResult);
			console.log("user Info: ", userStats);
			response.render('modal.html', { roomObj: finalresult, roomOBJ: JSON.stringify(finalresult), userOBJ: userStatsResult, userJSON: JSON.stringify(userStatsResult) });
		})
	})

}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// app.post('/submitModal', (request, response) => isLoggedin(request, settings => {
// 	console.log("Submit Modal Event: ", request);
// 	let roomJSON = request.body.roomOBJ;
// 	let userJSON = request.body.userJSON;
// 	let nickname = request.body.nickname;
// 	let secretMode = request.body.secretMode;
// 	let team = request.body.team;
// 	// response.send(201);
// 	// app.get(['/newRoom'], (request, response) => isLoggedin(request, settings => {
// 	response.render('room.html', { roomObj: roomJSON, roomOBJ: JSON.stringify(roomJSON), userOBJ: userJSON, userJSON: JSON.stringify(userJSON), username: request.session.account_username, role: request.session.account_role, team: team, secretMode: secretMode, nickname: nickname });
// 	// }))

// 	// response.render('/room.html', { roomObj: roomJSON, username: request.session.account_username, role: request.session.account_role, userJSON: userJSON, team: team, secretMode: secretMode, nickname: nickname});
// }));

// http://localhost:3000/room - display the room page with the live chat and video
app.post(['/room', '/room:id'], (request, response) => isLoggedin(request, settings => {

	const id = request.params.id; //params = {id:"000000"} for joining or creating a room 
	var room = request.query;

	let roomJSON = JSON.parse(request.body.roomObj);
	let userJSON = JSON.parse(request.body.userObj);
	let nickname = request.body.nickname;
	let secretMode = request.body.secretMode;
	let team = request.body.team;
	let join = request.body.join;
	let create = request.body.create;

	if (join == 1) { // if joining room

		response.render('room.html', { roomObj: roomJSON, roomObjText: request.body.roomObj, userJSON: userJSON, userObjText: request.body.userObj, team: team, secret: secretMode, nickname: nickname, username: request.session.account_username, role: request.session.account_role });

	} else if (create == 1) {// if creating a room

		var createRoomInfo = room;
		connection.query('SELECT * FROM rooms WHERE roomID = ?', [room.roomID], function (err, isRoomDuplicated) {
			if (err) throw err;
			console.log("Duplicate: ", isRoomDuplicated);
			console.log("Length: ", isRoomDuplicated.length);
			if ((isRoomDuplicated.length > 0)) {
				console.log("Error: room with similar ID already exist");
			} else {
				connection.query('INSERT INTO rooms (roomID, host, passcode, topic, teams, users, private, watchCost, joinCost, tags) VALUES (?,?,?,?,?,?,?,?,?,?)', [room.roomID, room.host, room.passcode, room.topic, room.teams, { users: room.users }, room.private, room.watchcost, room.joincost, JSON.stringify(room.tags.split(","))], function (err, result) {
					if (err) throw err;
					console.log("New room created");
				});
				// Render room page
				response.render('room.html', { username: request.session.account_username, role: request.session.account_role, room: createRoomInfo, roomID: room.roomID });
			}
		});

	} else {
		// Render room template
		// response.render('room.html', { username: request.session.account_username, role: request.session.account_role, roomInfo: room, roomID: room.roomID });
		response.render('room.html', { roomObj: roomJSON, roomObjText: request.body.roomObj, userJSON: userJSON, userObjText: request.body.userObj, team: team, secret: secretMode, nickname: nickname, username: request.session.account_username, role: request.session.account_role });
	}

}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/logout - Logout page
app.get('/logout', (request, response) => {
	// Destroy session data
	request.session.destroy();
	// Clear remember me cookie
	response.clearCookie('rememberme');
	// Redirect to login page
	response.redirect('/');
});

// http://localhost:3000/admin/ - Admin dashboard page
app.get('/admin/', (request, response) => isAdmin(request, settings => {
	// Retrieve statistical data
	connection.query('SELECT * FROM accounts WHERE cast(registered as DATE) = cast(now() as DATE) ORDER BY registered DESC; SELECT COUNT(*) AS total FROM accounts LIMIT 1; SELECT COUNT(*) AS total FROM accounts WHERE last_seen < date_sub(now(), interval 1 month) LIMIT 1; SELECT * FROM accounts WHERE last_seen > date_sub(now(), interval 1 day) ORDER BY last_seen DESC; SELECT COUNT(*) AS total FROM accounts WHERE last_seen > date_sub(now(), interval 1 month) LIMIT 1', (error, results, fields) => {
		// Render dashboard template
		// console.log("Admin results: ", results);
		response.render('admin/dashboard.html', { selected: 'dashboard', accounts: results[0], accounts_total: results[1][0], inactive_accounts: results[2][0], active_accounts: results[3], active_accounts2: results[4][0], timeElapsedString: timeElapsedString });
	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/accounts - Admin accounts page
app.get(['/admin/accounts', '/admin/accounts/:msg/:search/:status/:activation/:role/:order/:order_by/:page'], (request, response) => isAdmin(request, settings => {
	// Params validation
	let msg = request.params.msg == 'n0' ? '' : request.params.msg;
	let search = request.params.search == 'n0' ? '' : request.params.search;
	let status = request.params.status == 'n0' ? '' : request.params.status;
	let activation = request.params.activation == 'n0' ? '' : request.params.activation;
	let role = request.params.role == 'n0' ? '' : request.params.role;
	let order = request.params.order == 'DESC' ? 'DESC' : 'ASC';
	let order_by_whitelist = ['id', 'username', 'email', 'activation_code', 'role', 'registered', 'last_seen'];
	let order_by = order_by_whitelist.includes(request.params.order_by) ? request.params.order_by : 'id';
	// Number of accounts to show on each pagination page
	let results_per_page = 20;
	let page = request.params.page ? request.params.page : 1;
	let param1 = (page - 1) * results_per_page;
	let param2 = results_per_page;
	let param3 = '%' + search + '%';
	// SQL where clause
	let where = '';
	where += search ? 'WHERE (username LIKE ? OR email LIKE ?) ' : '';
	// Add filters
	if (status == 'active') {
		where += where ? 'AND last_seen > date_sub(now(), interval 1 month) ' : 'WHERE last_seen > date_sub(now(), interval 1 month) ';
	}
	if (status == 'inactive') {
		where += where ? 'AND last_seen < date_sub(now(), interval 1 month) ' : 'WHERE last_seen < date_sub(now(), interval 1 month) ';
	}
	if (activation == 'pending') {
		where += where ? 'AND activation_code != "activated" ' : 'WHERE activation_code != "activated" ';
	}
	if (role) {
		where += where ? 'AND role = ? ' : 'WHERE role = ? ';
	}
	// Params array and append specified params
	let params = [];
	if (search) {
		params.push(param3, param3);
	}
	if (role) {
		params.push(role);
	}
	// Fetch the total number of accounts
	connection.query('SELECT COUNT(*) AS total FROM accounts ' + where, params, (error, results) => {
		// Accounts total
		let accounts_total = results[0]['total'];
		// Append params to array
		params.push(param1, param2);
		// Retrieve all accounts from the database
		connection.query('SELECT * FROM accounts ' + where + ' ORDER BY ' + order_by + ' ' + order + ' LIMIT ?,?', params, (error, accounts) => {
			// Determine the URL
			let url = '/admin/accounts/n0/' + (search ? search : 'n0') + '/' + (status ? status : 'n0') + '/' + (activation ? activation : 'n0') + '/' + (role ? role : 'n0');
			// Determine message
			if (msg) {
				if (msg == 'msg1') {
					msg = 'Account created successfully!';
				} else if (msg == 'msg2') {
					msg = 'Account updated successfully!';
				} else if (msg == 'msg3') {
					msg = 'Account deleted successfully!';
				}
			}
			// Render accounts template
			response.render('admin/accounts.html', { selected: 'accounts', selectedChild: 'view', accounts: accounts, accounts_total: accounts_total, msg: msg, page: parseInt(page), search: search, status: status, activation: activation, role: role, order: order, order_by: order_by, results_per_page: results_per_page, url: url, timeElapsedString: timeElapsedString, Math: Math });
		});
	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/account - Admin edit/create account
app.get(['/admin/account', '/admin/account/:id'], (request, response) => isAdmin(request, settings => {
	// Default page (Create/Edit)
	let page = request.params.id ? 'Edit' : 'Create';
	// Current date
	let d = new Date();
	// Default input account values
	let account = {
		'username': '',
		'password': '',
		'email': '',
		'activation_code': '',
		'rememberme': '',
		'role': 'Member',
		'registered': (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1).split('.')[0],
		'last_seen': (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1).split('.')[0]
	};
	let roles = ['Member', 'Admin'];
	// GET request ID exists, edit account
	if (request.params.id) {
		connection.query('SELECT * FROM accounts WHERE id = ?', [request.params.id], (error, accounts) => {
			account = accounts[0];
			response.render('admin/account.html', { selected: 'accounts', selectedChild: 'manage', page: page, roles: roles, account: account });
		});
	} else {
		response.render('admin/account.html', { selected: 'accounts', selectedChild: 'manage', page: page, roles: roles, account: account });
	}
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/account - Admin edit/create account
app.post(['/admin/account', '/admin/account/:id'], (request, response) => isAdmin(request, settings => {
	// GET request ID exists, edit account
	if (request.params.id) {
		// Edit an existing account
		page = 'Edit'
		// Retrieve account by ID with the GET request ID
		connection.query('SELECT * FROM accounts WHERE id = ?', [request.params.id], (error, accounts) => {
			// If user submitted the form
			if (request.body.submit) {
				// update account
				let password = accounts[0]['password']
				// If password exists in POST request
				if (request.body.password) {
					password = cryptography.createHash('sha1').update(request.body.password).digest('hex');
				}
				// Update account details
				connection.query('UPDATE accounts SET username = ?, password = ?, email = ?, activation_code = ?, rememberme = ?, role = ?, registered = ?, last_seen = ? WHERE id = ?', [request.body.username, password, request.body.email, request.body.activation_code, request.body.rememberme, request.body.role, request.body.registered, request.body.last_seen, request.params.id]);
				// Redirect to admin accounts page
				response.redirect('/admin/accounts/msg2/n0/n0/n0/n0/ASC/id/1');
			} else if (request.body.delete) {
				// delete account
				response.redirect('/admin/account/delete/' + request.params.id);
			}
		});
	} else if (request.body.submit) {
		// Hash password
		let password = cryptography.createHash('sha1').update(request.body.password).digest('hex');
		// Create account
		connection.query('INSERT INTO accounts (username,password,email,activation_code,rememberme,role,registered,last_seen) VALUES (?,?,?,?,?,?,?,?)', [request.body.username, password, request.body.email, request.body.activation_code, request.body.rememberme, request.body.role, request.body.registered, request.body.last_seen]);
		// Redirect to admin accounts page
		response.redirect('/admin/accounts/msg1/n0/n0/n0/n0/ASC/id/1');
	}
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/account/delete/:id - Delete account based on the ID param
app.get('/admin/account/delete/:id', (request, response) => isAdmin(request, settings => {
	// GET request ID exists, delete account
	if (request.params.id) {
		connection.query('DELETE FROM accounts WHERE id = ?', [request.params.id]);
		response.redirect('/admin/accounts/msg3/n0/n0/n0/n0/ASC/id/1');
	}
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/roles - View accounts roles
app.get('/admin/roles', (request, response) => isAdmin(request, settings => {
	// Roles list
	let roles_list = ['Member', 'Admin'];
	// Select and group roles from the accounts table
	connection.query('SELECT role, COUNT(*) as total FROM accounts GROUP BY role; SELECT role, COUNT(*) as total FROM accounts WHERE last_seen > date_sub(now(), interval 1 month) GROUP BY role; SELECT role, COUNT(*) as total FROM accounts WHERE last_seen < date_sub(now(), interval 1 month) GROUP BY role', (error, roles) => {
		// Roles array
		new_roles = {};
		// Update the structure
		for (const role in roles[0]) {
			new_roles[roles[0][role]['role']] = roles[0][role]['total'];
		}
		for (const role in roles_list) {
			if (!new_roles[roles_list[role]]) new_roles[roles_list[role]] = 0;
		}
		// Get the total number of active roles
		new_roles_active = {};
		for (const role in roles[1]) {
			new_roles_active[roles[1][role]['role']] = roles[1][role]['total'];
		}
		// Get the total number of inactive roles
		new_roles_inactive = {};
		for (const role in roles[2]) {
			new_roles_inactive[roles[2][role]['role']] = roles[2][role]['total'];
		}
		// Render roles template
		response.render('admin/roles.html', { selected: 'roles', roles: new_roles, roles_active: new_roles_active, roles_inactive: new_roles_inactive });
	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/emailtemplate - View email templates (GET)
app.get(['/admin/emailtemplate', '/admin/emailtemplate/:msg'], (request, response) => isAdmin(request, settings => {
	// Output message
	let msg = request.params.msg;
	// Read template files
	const activation_email_template = fs.readFileSync(path.join(__dirname, 'views/activation-email-template.html'), 'utf8');
	const twofactor_email_template = fs.readFileSync(path.join(__dirname, 'views/twofactor-email-template.html'), 'utf8');
	// Determine message
	if (msg == 'msg1') {
		msg = 'Email templates updated successfully!';
	} else {
		msg = '';
	}
	// Render emails template
	response.render('admin/emailtemplates.html', { selected: 'emailtemplate', msg: msg, activation_email_template: activation_email_template, twofactor_email_template: twofactor_email_template });
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/emailtemplate - Update email templates (POST)
app.post(['/admin/emailtemplate', '/admin/emailtemplate/:msg'], (request, response) => isAdmin(request, settings => {
	// If form submitted
	if (request.body.activation_email_template && request.body.twofactor_email_template) {
		// Update the template files
		fs.writeFileSync(path.join(__dirname, 'views/activation-email-template.html'), request.body.activation_email_template);
		fs.writeFileSync(path.join(__dirname, 'views/twofactor-email-template.html'), request.body.twofactor_email_template);
		// Redirect and output message
		response.redirect('/admin/emailtemplate/msg1');
	}
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/settings - View settings (GET)
app.get(['/admin/settings', '/admin/settings/:msg'], (request, response) => isAdmin(request, settings => {
	// Output message
	let msg = request.params.msg;
	// Determine message
	if (msg == 'msg1') {
		msg = 'Settings updated successfully!';
	} else {
		msg = '';
	}
	// Retrieve settings
	getSettings(settings => {
		// Render settings template
		response.render('admin/settings.html', { selected: 'settings', msg: msg, settings: settings, settingsFormatTabs: settingsFormatTabs, settingsFormatForm: settingsFormatForm });
	});
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/settings - Update settings (POST)
app.post(['/admin/settings', '/admin/settings/:msg'], (request, response) => isAdmin(request, settings => {
	// Update settings
	for (let item in request.body) {
		let key = item;
		let value = request.body[item];
		if (value.includes('true')) {
			value = 'true';
		}
		connection.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
	}
	// Redirect and output message
	response.redirect('/admin/settings/msg1');
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/myaccount - Redirect to edit account page
app.get('/admin/myaccount', (request, response) => isAdmin(request, settings => {
	// Redirect to edit account page
	response.redirect('/admin/account/' + request.session.account_id);
}, () => {
	// Redirect to login page
	response.redirect('/');
}));

// http://localhost:3000/admin/about - View about page
app.get('/admin/about', (request, response) => isAdmin(request, settings => {
	// Render about template
	response.render('admin/about.html', { selected: 'about' });
}, () => {
	// Redirect to login page
	response.redirect('/');
}));
// Function that checks whether the user is logged-in or not
const isLoggedin = (request, callback, callback2) => {
	// Check if the loggedin param exists in session
	init(request, settings => {
		if (request.session.account_loggedin) {
			return callback !== undefined ? callback(settings) : false;
		} else if (request.cookies.rememberme) {
			// if the remember me cookie exists check if an account has the same value in the database
			connection.query('SELECT * FROM accounts WHERE rememberme = ?', [request.cookies.rememberme], (error, accounts, fields) => {
				if (accounts.length > 0) {
					request.session.account_loggedin = true;
					request.session.account_id = accounts[0].id;
					request.session.account_username = accounts[0].username;
					request.session.account_role = accounts[0].role;
					request.session.account_password = accounts[0].password;
					return callback !== undefined ? callback(settings) : false;
				} else {
					return callback2 !== undefined ? callback2(settings) : false;
				}
			});
		} else {
			return callback2 !== undefined ? callback2(settings) : false;
		}
	});
};

// Function is admin
const isAdmin = (request, callback, callback2) => {
	isLoggedin(request, () => {
		if (request.session.account_role == 'Admin') {
			callback();
		} else {
			callback2();
		}
	}, callback2);
};

// Function init - check loggedin and retrieve settings
const init = (request, callback) => {
	if (request.session.account_loggedin) {
		// Update last seen date
		let d = new Date();
		let now = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1).split('.')[0];
		connection.query('UPDATE accounts SET last_seen = ? WHERE id = ?', [now, request.session.account_id]);
	}
	connection.query('SELECT * FROM settings', (error, settings) => {
		if (error) throw error;
		let settings_obj = {};
		for (let i = 0; i < settings.length; i++) {
			settings_obj[settings[i].setting_key] = settings[i].setting_value;
		}
		callback(settings_obj);
	});
};

// LoginAttempts function - prevents bruteforce attacks
const loginAttempts = (ip, update = true, callback) => {
	// Get the current date
	let d = new Date();
	let now = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1).split('.')[0];
	// Update attempts left
	if (update) {
		connection.query('INSERT INTO login_attempts (ip_address, `date`) VALUES (?,?) ON DUPLICATE KEY UPDATE attempts_left = attempts_left - 1, `date` = VALUES(`date`)', [ip, now]);
	}
	// Retrieve the login attempts from the db
	connection.query('SELECT * FROM login_attempts WHERE ip_address = ?', [ip], (error, results) => {
		let login_attempts = [];
		if (results.length > 0) {
			// Determine expiration date
			let expire = new Date(results[0].date);
			expire.setDate(expire.getDate() + 1);
			// If current date is greater than the expiration date
			if (d.getTime() > expire.getTime()) {
				// Delete attempts
				connection.query('DELETE FROM login_attempts WHERE id_address = ?', [ip]);
			} else {
				login_attempts = results[0];
			}
		}
		// Execute callback function
		if (callback != undefined) callback(login_attempts);
	});
};

// format settings key
const settingsFormatKey = key => {
	key = key.toLowerCase().replaceAll('_', ' ').replace('url', 'URL').replace('db ', 'Database ').replace(' pass', ' Password').replace(' user', ' Username').replace(/\b\w/g, l => l.toUpperCase());
	return key;
};

// Format settings variables in HTML format
const settingsFormatVarHtml = (key, value) => {
	let html = '';
	let type = 'text';
	type = key == 'pass' ? 'password' : type;
	type = ['true', 'false'].includes(value.toLowerCase()) ? 'checkbox' : type;
	checked = value.toLowerCase() == 'true' ? ' checked' : '';
	html += '<label for="' + key + '">' + settingsFormatKey(key) + '</label>';
	if (type == 'checkbox') {
		html += '<input type="hidden" name="' + key + '" value="false">';
	}
	html += '<input type="' + type + '" name="' + key + '" id="' + key + '" value="' + value + '" placeholder="' + settingsFormatKey(key) + '"' + checked + '>';
	return html;
};

// Format settings tabs
const settingsFormatTabs = tabs => {
	let html = '';
	html += '<div class="tabs">';
	html += '<a href="#" class="active">General</a>';
	for (let tab in tabs) {
		html += '<a href="#">' + tabs[tab] + '</a>';
	}
	html += '</div>';
	return html;
};

// Format settings form
const settingsFormatForm = settings => {
	let html = '';
	html += '<div class="tab-content active">';
	let category = '';
	for (let setting in settings) {
		if (category != '' && category != settings[setting]['category']) {
			html += '</div><div class="tab-content">';
		}
		category = settings[setting]['category'];
		html += settingsFormatVarHtml(settings[setting]['key'], settings[setting]['value']);
	}
	html += '</div>';
	return html;
};

// Get settings from database
const getSettings = callback => {
	try {
		connection.query('SELECT * FROM settings ORDER BY id', (error, settings, fields) => {
			settings2 = {};
			for (let setting in settings) {
				settings2[settings[setting]['setting_key']] = { 'key': settings[setting]['setting_key'], 'value': settings[setting]['setting_value'], 'category': settings[setting]['category'] };
			}
			callback(settings2);
		});
	} catch (e) {
		console.log(e);
	}
};

// Formate date to time elapsed string
const timeElapsedString = date => {
	let seconds = Math.floor((new Date() - new Date(String(date).replace(/-/g, '/'))) / 1000);
	let interval = seconds / 31536000;
	if (interval > 1) {
		return Math.floor(interval) + ' years';
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + ' months';
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + ' days';
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + ' hours';
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + ' minutes';
	}
	return Math.floor(seconds) + ' seconds';
};

var roomScores = [];
var roomNames = [];
var activeRoomandUsers = {};


// Run when client connects
io.on('connection', socket => {

	socket.on('user joined room', (roomId, username, item, time, room, mode, teams) => {
		const teamroom = io.sockets.adapter.rooms.get(roomId);
		console.log("joining room", roomId)
		// if (teamroom && teamroom.size === 4) {
		// 	socket.emit('server is full');
		// 	return;
		// }

		const otherUsers = [];

		if (teamroom) {
			teamroom.forEach(id => {
				otherUsers.push(id);
			})
		}

		socket.join(roomId);
		socket.emit('all other users', otherUsers);
		// console.log("joined room: ", roomId);
	});

	socket.on('peer connection request', ({ userIdToCall, sdp }) => {
		io.to(userIdToCall).emit("connection offer", { sdp, callerId: socket.id });
	});

	socket.on('connection answer', ({ userToAnswerTo, sdp }) => {
		// io.to(userToAnswerTo).emit('connection answer', { sdp, answererId: socket.id });
		io.to(userToAnswerTo).emit('connection answer', sdp, socket.id)
	});

	socket.on('ice-candidate', ({ target, candidate }) => {
		io.to(target).emit('ice-candidate', { candidate, from: socket.id });
	});

	socket.on('disconnecting', () => {
		socket.rooms.forEach(room => {
			socket.to(room).emit('user disconnected', socket.id);
		});
	});

	socket.on('hide remote cam', targetId => {
		io.to(targetId).emit('hide cam');
	});

	socket.on('show remote cam', targetId => {
		io.to(targetId).emit('show cam')
	})

	//Create a room and join room

	socket.on('joinRoomHome', (payload) => {

		let room = payload;
		console.log("room Info: ", room.roomID);
		connection.query("SELECT * FROM rooms WHERE roomID = ?", [room.roomID], function (err, finalresult) {
			if (err) throw err;

			console.log("Joined Room Info: ", finalresult);
			if (room.passcode == finalresult[0]["passcode"]) {
				joindata[room.randNum] = room;
			} else {
				console.log("Wrong Passcode.")
			}

		})
	})

	//Create a room 
	socket.on('createRoomHome', (payload) => {
		let room = payload;
		console.log("Room Info (socketIO): ", room.roomID);
		createRoomData[room.randNum] = room;
	})

	// get a array object of the users' stats in the room roomId and returns it
	socket.on('sendUserStatus', (roomId, userData) => {
		if (activeRoomandUsers[roomId] == null) {
			activeRoomandUsers[roomId] = [];
		}
		let objIndex = activeRoomandUsers[roomId].findIndex((obj => obj.name == userData.name))
		activeRoomandUsers[roomId][objIndex] = userData;
	});

	// send an array object of the users' stats in the room roomId 
	socket.on('askForRoomUpdate', (roomId) => {
		if (activeRoomandUsers[roomId] == null) {
			activeRoomandUsers[roomId] = [];
		}
		io.emit('getActiveUsers', roomId, activeRoomandUsers[roomId]);
	});

	socket.on("sendImageToCanvas", (imagesrc, targetCanvas, roomId, userId, imgSentToCanvas, rotation, scale) => {
		// var files = fs.readdirSync('./public/images/');
		console.log("Imgs to room:", roomId, "by user:", userId);
		io.emit('drawImageToCanvas', imagesrc, targetCanvas, roomId, userId, imgSentToCanvas, rotation, scale);
	})

	socket.on("sendSoundToCanvas", (soundsrc, targetCanvas, roomId, userId, msg, volume) => {
		// var files = fs.readdirSync('./public/images/');
		console.log("Sound to room:", roomId, "by user:", userId);
		io.emit('soundToCanvas', soundsrc, targetCanvas, roomId, userId, msg, volume);
	})

	// Run once when connecting to room for each user to get list of sounds and images
	socket.on("fetchMedia", (roomId, userId) => {
		var Imgfiles = fs.readdirSync('./public/images/');
		var Sndfiles = fs.readdirSync('./public/sounds/');
		console.log("Imgs to room:", roomId, "by user:", userId);
		io.emit('fetchMediaList', Imgfiles, Sndfiles);
	})

	socket.on('connectNewStream', (roomId, peerId, userData) => {
		console.log("New User connected:");
		// console.log("room: ", roomId, ", ", "peerId: ", peerId);
		// console.log("userData: ", userData);
		socket.join(roomId)

		if (activeRoomandUsers[roomId] == null) {
			activeRoomandUsers[roomId] = [];
		}

		activeRoomandUsers[roomId].push(userData);
		const ids = activeRoomandUsers[roomId].map(o => o.name)
		activeRoomandUsers[roomId] = activeRoomandUsers[roomId].filter(({ id }, index) => !ids.includes(id, index + 1))

		// console.log(`Active Users in room: ${roomId}:`, activeRoomandUsers[roomId]);

		io.emit('userConnected', activeRoomandUsers[roomId], roomId, userData);
		// io.emit('getActiveUsers', roomId, activeRoomandUsers[roomId]);

		socket.on('disconnect', () => {
			// filter out disconnected user

			var disconnectedUser = activeRoomandUsers[roomId].find(user => user.id === socket.id);

			// clear scores array for empty room
			if (activeRoomandUsers[roomId].length == 0) {
				roomScores[roomId] = null;
			}

			console.log(`ActiveRoomandUsers[${roomId}]:`, activeRoomandUsers[roomId])
			if (activeRoomandUsers[roomId] != undefined) // if not empty
				activeRoomandUsers[roomId] = activeRoomandUsers[roomId].filter(x => x.name !== userData.name);
			console.log("User ", userData.name, "has left room: ", roomId);
			try {
				io.emit('user-disconnected', disconnectedUser.peerId, activeRoomandUsers[roomId], roomId, userData)
			} catch (error) {
				io.emit('user-disconnected', userData.name, activeRoomandUsers[roomId], roomId, userData)
			}

		})
	});

	var roomTeamStreams = {};
	socket.on("setStreamJoinConfig", (userid, team, time, room, mode, teams) => {

		if (mode == "FFF") {
			const user = getCurrentUser(socket.id);
			console.log("FFA Event by:", userid)
			user.team = team;
			io.emit("streamJoinConfig", userid, team, time, room)
		}
		if (mode == "1perTeam") {
			if (roomTeamStreams[room] == null) {
				teams.forEach((item, index) => {
					roomTeamStreams[room][item] = []
				});
			}
			const user = getCurrentUser(socket.id);
			if (roomTeamStreams[room][team] == []) {
				roomTeamStreams[room][team] = [userid]
				setTimeout(() => {
					roomTeamStreams[room][team] = []
				}, 30000)
				console.log("setStreamJoinConfig Event by:", userid)
				user.team = team;
				io.emit("streamJoinConfig", userid, team, time, room)
			}
		}
	})

	//LIVE CHAT
	socket.on('joinRoom', ({ username, room, nickname, points, xp, secretMode, team, score, pfp }) => {
		const user = userJoin(socket.id, username, nickname, points, xp, room, secretMode, team, score, pfp);

		socket.join(user.room);

		// Welcome current user
		socket.emit('message', formatMessage(botName, `Welcome in ${user.username}, you joined the room: ${user.room} and are on team: ${user.team}!`, null));

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(botName, `${user.username} has joined the chat`, null)
			);

		// Send users and room info
		io.to(user.room).emit('roomUsers',
			user.room,
			getRoomUsers(user.room)
		);

		// // update scores array
		// if (roomScores[room] == null) {

		// 	roomScores[room] = new Array(teams.length);

		// 	teams.forEach((item, index) => {
		// 		roomScores[room][index] = 5;
		// 	})
		// }

		ActiveUsers();

	});

	function outputScores() {
		// if (roomScores != null) {
		// console.log("rmScores: ", roomScores[roomNames[0]])
		// roomScores.forEach((item, index) => {
		// console.log("RM Length: ", roomNames.slength)
		for (i = 0; i < roomNames.length; i++) {
			// console.log(i);
			let roomname = roomNames[i];
			// console.log("RoomScores[roomname]: ", roomScores[i].roomname)

			// if (roomScores[roomname] != null) {
			socket.emit("Scores", roomname, roomScores[roomNames[i]])
			// }
		}

	}

	// Add to te Room scores array
	socket.on("startScoreKeeping", (room, teams) => {
		// update scores array
		if (roomScores[room] == null) {

			roomScores[room] = new Array(teams.length);
			roomNames[roomScores.length] = room;

			teams.forEach((item, index) => {
				roomScores[room][index] = 0;
			})

			console.log("Room names: ", roomNames[roomScores.length]);
			console.log("started score Keeping: ", roomScores[room], "for Room: ", room);
		}

	})

	socket.on("incrementScore", (amount, trgtTeam, roomId) => {
		// to team Scores
		roomScores[roomId][trgtTeam] += parseInt(amount);
		//Logg the scores
		// console.log("add to score for team: ", trgtTeam, ", result: ", roomScores[roomId][trgtTeam])

		//delay this until define in the incrementSCore socket is triggered
		// setTimeout(() => {
		outputScores()
		// }, 5000)
	})

	socket.on("resetscores", (roomId) => {
		//if (roomScores[roomId] == null) 
		roomScores[roomId].forEach((item, index) => {
			roomScores[roomId][index] = 0;
		})
		console.log("Scores for room: ", roomId, ", result: ", roomScores[roomId]);
	})

	// Listen for tipMessgae
	socket.on('Tip', (currentUser, tippedUser, coins) => {
		try {
			const user = getCurrentUser(socket.id);
			io.emit('tipEvent', currentUser, tippedUser, coins, user.room);
			// io.to(user.room).emit('tipEvent', currentUser, tippedUser, coins);
		}
		catch (e) {
			console.log(e);
		}
	});

	// Listen for chatMessageTo
	socket.on('chatMessageTo', (msg, toUser) => {
		try {
			const user = getCurrentUser(socket.id);
			io.to(user.room).emit('messageTo', formatMessage(user.username, msg, user.secretMode, user.pfp), toUser);
		} catch (e) {
			console.log(e);
		}
	});

	// Listen for chatMessage
	socket.on('chatMessage', msg => {
		try {
			const user = getCurrentUser(socket.id);
			io.to(user.room).emit('message', formatMessage(user.username, msg, user.secretMode, user.pfp), null);
		} catch (e) {
			console.log(e);
		}
	});

	// Listen for replyMessage
	socket.on('replyMessage', (msg, replyTo) => {
		try {
			const user = getCurrentUser(socket.id);
			io.to(user.room).emit('message', formatMessage(user.username, msg, user.secretMode, user.pfp), replyTo);
		} catch (e) {
			console.log(e);
		}
	});

	// Listen for chatVote
	socket.on('chatVote', (voter, msg_id, vote) => {
		try {
			const user = getCurrentUser(socket.id);
			io.to(user.room).emit('vote', msg_id, vote, voter);
		} catch (e) {
			console.log(e);
		}
	});

	socket.on('updateStats', (xp, coins, username, score, team, room) => {
		const user = getCurrentUser(socket.id);
		// rooms[user.rom]
		// update scores array
		// if (roomScores[room] == null)
		// 	roomScores[room] = [];
		// if (roomScores[room][team] == null)
		// 	roomScores[room][team] = 20;

		// roomScores[room][team] += score;

		// console.log("RmS:", roomScores)

		// socket.emit("Scores", room, roomScores[room]);

		connection.query("UPDATE userstats SET xp = ? WHERE username = ?", [xp, username], (error, updateResults) => {
			if (error) throw error;
			// console.log("Set " + username + " xp to: " + xp);
			// console.log("results of XP update: ", updateResults);
		});
		connection.query("UPDATE userstats SET coins = ? WHERE username = ?", [coins, username], (error, updateResults) => {
			if (error) throw error;
			// console.log("Set " + username + " coin to: " + coins);
			// console.log("results of XP update: ", updateResults);
		});
		// console.log(username, "stats updated", " XP: ", xp, "coins: ", coins);
	});

	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			ActiveUsers();
			io.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} has left the chat in room: ${user.room}`, null)
			);
			console.log("user disconnect event: ", user.username);
			// Send users and room info
			io.to(user.room).emit('roomUsers',
				user.room,
				getRoomUsers(user.room)
			);
		}
	});

	function ActiveUsers() {
		//update users
		var listOfUsersInRoom = getActiveUsers();
		var currentRoom = getActiveRoom();

		var data = {
			room: currentRoom,
			users: listOfUsersInRoom
		}
		console.log("Update Data: ", data);
		connection.query("UPDATE rooms SET users = ? WHERE roomID = ?", [JSON.stringify(data.users), data.room], (error, updateResults) => {
			if (error) throw error;
			//console.log("results of update: ", updateResults);
		});
	}
});

app.post('/tip', (request, response) => isLoggedin(request, settings => {
	console.log("tip info: ", request.body);
	var tipJSON = (request.body);
	var tippedUser = tipJSON.userToTip;
	var currentUser = tipJSON.currentUser;
	var recieverOfCoins; var giverOfCoins; var giveCoins; var recieveCoins;
	console.log("tip user => ", tippedUser);
	console.log("current user => ", currentUser);
	connection.query("SELECT * FROM userstats WHERE username = ?", [currentUser], (error, coinresults1) => {
		//giverOfCoins = Object.values(JSON.parse(JSON.stringify(coinresults1)));
		giverOfCoins = coinresults1
		giveCoins = (giverOfCoins[0]["coins"]) - 1;
		console.log("giverOfCoins: ", giveCoins);
	});
	if (tippedUser == "BOT") {
		if (Math.ceil(Math.random() * 10) > 9) {
			let amt = Math.ceil(Math.random() * 100);
			console.log("reward: ", amt)
			giveCoins = giveCoins + amt;
		}
	} else {
		connection.query("SELECT coins FROM userstats WHERE username = ?", [tippedUser], (error, coinresults2) => {
			recieverOfCoins = coinresults2;
			// recieverOfCoins = Object.values(JSON.parse(JSON.stringify(coinresults2)));

			recieveCoins = (recieverOfCoins[0]["coins"]) + 1;
			console.log("recieverOfCoins: ", recieveCoins);
		});
	}

	setTimeout(doSumtin, 1000);

	function doSumtin() {
		connection.query("UPDATE userstats SET coins = ? WHERE username = ?", [giveCoins, currentUser], (error, results1) => {
			if (error) throw error;
			//console.log("result 1: ", results1.affectedRows);
		});
		if (tippedUser != "BOT") {
			connection.query("UPDATE userstats SET coins = ? WHERE username = ?", [recieveCoins, tippedUser], (error, results2) => {
				if (error) throw error;
				//console.log("result 2: ", results2.affectedRows);
			});
		}
	}

	// } catch (e) {
	// 	throw e;
	// }
}));

app.post('/follow', (request, response) => isLoggedin(request, settings => {
	var userToBeFollowed = request.body.userToFollow;
	var currentUser = request.body.currentUser;
	var action = request.body.action;
	var userFriends; var otherUserFollowersList;

	connection.query("SELECT friends FROM userstats WHERE username = ?", [currentUser], (error, friendresults) => {
		if (error) throw error;
		console.log("userFriends Results: ", friendresults[0]["friends"]);
		//userFriends = JSON.parse(JSON.stringify((friendresults1)));//friendresults1;
		try {
			userFriends = JSON.parse(friendresults[0].friends);
		} catch (e) {
			userFriends = [""];
		}
		// userFriends = JSON.parse(friendresults[0].friends);
		console.log("userFriends: ", userFriends);

		connection.query("SELECT followers FROM userstats WHERE username = ?", [userToBeFollowed], (error, followedUser) => {
			if (error) throw error;
			console.log("Follower Results: ", followedUser[0]["followers"]);
			//userFriends = JSON.parse(JSON.stringify((friendresults1)));//friendresults1;
			try {
				otherUserFollowersList = JSON.parse(followedUser[0]["followers"]);
			} catch (e) {
				otherUserFollowersList = [""];
			}
			// userFriends = JSON.parse(friendresults[0].friends);
			console.log("Followed Users List of Friends: ", otherUserFollowersList);
		})


		setTimeout(doSumn, 500);
	})

	function doSumn() {
		try {
			if (action == "add") { // add user or remove
				// adds to array
				userFriends.push(userToBeFollowed);
				otherUserFollowersList.push(currentUser);
				// filters out duplicates
				userFriends = userFriends.filter((item, index) => index == userFriends.indexOf(item)); // add a user and remove duplicates
				otherUserFollowersList = otherUserFollowersList.filter((item, index) => index == otherUserFollowersList.indexOf(item));
			} else if (action == "remove") {
				function removeFriend(user) {
					return userToBeFollowed != user;
				}
				function removeFollower(user) {
					return currentUser != user;
				}
				otherUserFollowersList = otherUserFollowersList.filter(removeFollower)
				userFriends = userFriends.filter(removeFriend); // remove a user is added
			}
			connection.query("UPDATE userstats SET friends = ? WHERE username = ?", [JSON.stringify(userFriends), currentUser], (error, results2, fields) => {
				if (error) throw error;
				//console.log("Current User Friends: ", results2);
			});
			connection.query("UPDATE userstats SET followers = ? WHERE username = ?", [JSON.stringify(userFriends), userToBeFollowed], (error, results2, fields) => {
				if (error) throw error;
				//console.log("Current User Friends: ", results2);
			});
		} catch (e) {
			throw e;
		}

		console.log("Done Follow Opporation");
	}
}));

app.post('/block', (request, response) => isLoggedin(request, settings => {
	var blockedUser = request.body.userToBlock;
	var currentUser = request.body.currentUser;
	var blockedUsers;
	connection.query("SELECT blockedUsers FROM userstats WHERE username = ?", [currentUser], (error, blockedUsersresults) => {
		if (error) throw error;
		console.log("userFriends Results: ", blockedUsersresults[0]["blockedUsers"]);
		//userFriends = JSON.parse(JSON.stringify((friendresults1)));//friendresults1;
		try {
			blockedUsers = JSON.parse(blockedUsersresults[0]["blockedUsers"]);
		} catch (e) {
			blockedUsers = [""];
		}
		// userFriends = JSON.parse(friendresults[0].friends);
		console.log("Blocked Users Array: ", blockedUsers);
		setTimeout(doSumn, 500);
	});
	function doSumn() {
		try {
			if (blockedUsers.indexOf(blockedUser) < 0) {
				console.log("Removing ", blockedUser, " from blocked list");
				blockedUsers = blockedUsers.filter(blkdUser => blkdUser !== blockedUser);
			} else {
				blockedUsers.push(blockedUser); // adds to array
				// filters out duplicates
				blockedUsers = blockedUsers.filter((item, index) => index == blockedUsers.indexOf(item));
				console.log("Adding ", blockedUser, " to blocked list");
			}
			connection.query("UPDATE userstats SET blockedUsers = ? WHERE username = ?", [JSON.stringify(blockedUsers), currentUser], (error, results2, fields) => {
				if (error) throw error;
				//console.log("Current User Friends: ", results2);
			});
		} catch (e) {
			throw e;
		}
		console.log("Done Block Opperation");
	};
	// connection.query("UPDATE userstats SET blockedUsers = ? WHERE username = ?", [blockedUser, currentUser], (error, results2, fields) => {
	// 	if (error) throw error;
	// 	//console.log("Current User Friends: ", results2);
	// });
}));


app.post('/sendMessage', (request, response) => isLoggedin(request, settings => {
	var msg = request.body.msg;
	var toUser = request.body.touser;
	var fromUser = request.body.fromuser;
	console.log("Msg: ", msg);
	var text = request.body.msg.Text;
	var msgID = request.body.msg.msgId;
	var data = request.body.msg.data;
	var date = request.body.msg.date

	var message, messageFrom;
	connection.query("SELECT messsages FROM userstats WHERE username = ?", [fromUser], (error, msg) => {
		if (error) throw error;
		console.log("Msg Results: ", msg);
		try {
			messageFrom = JSON.parse(msg);
		} catch (e) {
			messageFrom = [""];
		}
		console.log("Blocked Users Array: ", messageFrom);

		connection.query("SELECT messsages FROM userstats WHERE username = ?", [toUser], (error, msg) => {
			if (error) throw error;
			console.log("Msg Results: ", msg);
			//userFriends = JSOotherChatUserN.parse(JSON.stringify((friendresults1)));//friendresults1;
			try {
				message = JSON.parse(msg);
			} catch (e) {
				message = [""];
			}
			// userFriends = JSON.parse(friendresults[0].friends);
			console.log("Blocked Users Array: ", message);
			setTimeout(doSumn, 500);
		});
	})
	function doSumn() {
		try {
			const d = new Date();

			var payload = {
				"touser": toUser,
				"fromuser": fromUser,
				"msg": {
					"msgId": fromUser + `${d.getHours()}:${d.getMinutes()} ` + `${d.getMonth} / ${d.getDay} / ${d.getFullYear}` + toUser,
					"from": fromUser,
					"to": toUser,
					"date": [`${d.getHours()}:${d.getMinutes()} `, `${d.getMonth} / ${d.getDay} / ${d.getFullYear}`],
					"Text": text,
					"data": data
				}
			};

			message[message.length] = payload;
			connection.query("UPDATE userstats SET messages = ? WHERE username = ?", [JSON.stringify(message), toUser], (error, results2, fields) => {
				if (error) throw error;
				//console.log("Current User Friends: ", results2);
			});

		} catch (e) {
			throw e;
		}
		console.log("Sent Message Opperation");
	};

}));




const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

