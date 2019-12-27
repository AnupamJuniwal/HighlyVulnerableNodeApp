const express = require('express');
const app = express();
const body_parser = require('body-parser');
const fs = require('fs')
const child_proc = require('child_process')
const path = require('path')

const APP_PORT = process.env.APP_PORT || 8080;
const FILES_DIR = "files";
const LONG_LIST_CMD = "ls -lrt ";

app.use('/', express.static('public'))

app.use(body_parser.json({extended: false}));


app.listen(APP_PORT, function(err){
	if(err){
		console.log(err)
	} else {
		console.log("Server running at port: ", APP_PORT)
	}
})

app.get('/',function(req,resp,next){
	resp.sendFile("/index.html")
})

app.post('/file',async function(req,resp,next){
	let fileName = req.body.filename;
	let data = req.body.data
	try{
		fileName = await createFileAsync(fileName, data)
		resp.send(fileName)
	} catch (err){
		resp.send(err)
	}
})



app.get('/file',async function(req, resp, next){
	let filename = req.query.filename;
	try{
		let fileData = await readFileAsync(fileName)
		resp.send(fileData)
	} catch (err){
		resp.send(err)
	}
})


app.post('/cmd',async function(req, resp, next){
	let cmd = req.body.cmd;
	try{
		let cmdResult = await execAsync(cmd)
		resp.send(cmdResult)
	} catch (err){
		resp.send(err)
	}
})


app.post('/cmd/async', function(req, resp, next){
	let cmd = req.body.cmd;
	try{
		execAsync(cmd)
	} catch (err){
		resp.send(err)
	}
})


/**
 *	Function definations from here....
 *
 **/




function createFileAsync(name, data){
	return new Promise( (resolve, reject) => {
		fs.writeFile(path.join(__dirname,FILES_DIR,name), data,function(err){
			if(err){
				reject(err);
			}
			resolve(Name);
		})
	})
}


function readFileAsync(name, data){
	return new Promise( (resolve, reject) => {
		fs.readFile(path.join(__dirname,FILES_DIR,name),function(err, data){
			if(err){
				reject(err);
			}
			resolve(data);
		})
	})
}


function execAsync(command){
	return new Promise( (resolve, reject) => {
		child_proc.exec(LONG_LIST_CMD.concat(FILES_DIR).concat(command),function(err, result){
			if(err){
				reject(err);
			}
			resolve(result);
		})
	})
}
