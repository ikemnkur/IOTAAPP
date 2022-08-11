const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");
const mysql = require('mysql');

const app = express();
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	// port: 8889,
	password: '',//,password: 'root',
	database: 'vueApp',
	multipleStatements: true,
	bigNumberStrings: true,
});

app.use(express.json());
app.use(cors());

app.get("/outfit", (req, res) => {
	const tops = ["Black", "White", "Orange", "Navy"];
	const jeans = ["Grey", "Dark Grey", "Black", "Navy"];
	const shoes = ["White", "Grey", "Black"];

	res.json({
		top: _.sample(tops),
		jeans: _.sample(jeans),
		shoes: _.sample(shoes)
	});
});

app.get("/comments/:id", async (req, res) => {
	const id = req.params.id;
	let content;

	try {
		content = await fs.readFile(`data/comments/${id}.txt`, "utf-8");
	} catch (err) {
		return res.sendStatus(404);
	}

	res.json({
		content: top
	});
});

app.post("/comments", async (req, res) => {
	const id = uuid();
	const content = req.body;
	console.log("JSON Content: ", content);

	if (!content) {
		return res.sendStatus(400);
	}

	await fs.mkdir("data/comments", { recursive: true });
	await fs.writeFile(`data/comments/${id}.txt`, content.top);

	var con = connDB("", "root", "localhost", "vueApp");

	con.connect(function(err) {
		if (err) throw err;
		console.log("DB Connected!");
		//var sql = 'INSERT INTO rooms (Obj1) VALUES (?)', [content.top];
		
		con.query('INSERT INTO exampletbl (Obj) VALUES (?)', [content.shoes], function (err, result) {
			if (err) throw err;
			console.log("Result: " + result);
		});
	});
	  

	res.status(201).json({
		id: id
	});
});

app.post("/addRoom", async (req, res) => {
	var con = connDB("", "root", "localhost", "vueApp");
	con.connect(function(err) {
		const room = req.body;
		if (err) throw err;
		console.log("DB Connected!, Post Req.");
		console.log("Body: ", room);
		//var sql = 'INSERT INTO rooms (Obj1) VALUES (?)', [content.top];
		// con.query('INSERT INTO exampletbl (Obj) VALUES (?)', [content.shoes], function (err, result) {
		con.query('INSERT INTO rooms (roomID, host, passcode, topic, teams, users, private, watchCost, joinCost, tags) VALUES (?,?,?,?,?,?,?,?,?,?)', [room.roomID, room.host, room.passcode, room.topic, room.teams, room.users, room.private, room.watchcost, room.joincost, room.tags], function (err, result) {
			if (err) throw err;
			console.log("Result: " + result);
		});
	});
	res.status(201).json({
		id: uuid()
	});
});

app.get("/getRooms/:id", async (req, res) => {
	const id = req.params.id;
	var con = connDB("", "root", "localhost", "vueApp");
	con.connect(function(err) {
	
		if (err) throw err;
		console.log("DB Connected!, Get Req. ");
		//var sql = 'INSERT INTO rooms (Obj1) VALUES (?)', [content.top];
		// con.query('INSERT INTO exampletbl (Obj) VALUES (?)', [content.shoes], function (err, result) {
		if (id < 0){ //if negative fetch all rooms
			con.query('SELECT * FROM rooms', function (err, result) {
				if (err) {
					res.sendStatus(404);
					throw err;
				}					
				console.log("Fetch all rooms Result: ", result);
				res.json({
					result
				});
			});	
		} else {
			con.query('SELECT * FROM rooms WHERE id = ?', [id], function (err, result) {
				if (err) {
					res.sendStatus(404);
					throw err;
				}	
				console.log("Fetch 1 room Result: ", result);
				res.json({
					result
				});
			});	
		}
		
	});

});

app.listen(3020, () => console.log("API Server is running..."));

function connDB(password, user, url, db) {

	return connection = mysql.createConnection({
		host: url,
		user: user,
		// port: 8889,
		password: password,//,password: 'root',
		database: db,
		multipleStatements: true,
		bigNumberStrings: true,
	});
}