let path = require('path')
  , rootPath = path.join(__dirname, '..')
  , dbBase = path.join(rootPath, 'data')
  , logger = require('./logger'); 

let fs = require('then-fs'); 

let errHandle = error => {
	logger('DB Faild !'.error); 
	console.log(error.message.warn)
	

	return Promise.reject(error.message || error); 
}


let db = {}; 

db.save = (name, obj) => {
	name = name + '.json'; 

	let str = JSON.stringify(obj); 

	let dist = path.join(dbBase, name); 

	fs.writeFile(dist, str).then(() => {
		console.log(`db file ${name} Store Success`); 
	}).catch(errHandle)
}

db.load = name => {
	name = name + '.json'; 
	let from = path.join(dbBase, name); 

	return fs.readFile(from).then(data => {
		return JSON.parse(data.toString()); 
	})
}


// Ready 
(_ => {
	logger('DB READY, Files:'.warn, fs.readdirSync(dbBase).map(file => {
		let loc = path.join(dbBase, file);
		return [
			file.info,
			'  ..........  '.grey,
			(fs.statSync(loc).size + ' B').info,
		]
	}))
	console.log('\n\n'); 
})()

module.exports = db; 

