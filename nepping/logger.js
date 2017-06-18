// logger.js
var colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'red',
	info: 'green',
	data: 'blue',
	help: 'cyan',
	warn: 'yellow',
	debug: 'magenta',
	error: 'red'
});

function DatePro(date){
	var h, m, s; 
	h = date.getHours(); 
	m = date.getMinutes(); 
	s = date.getSeconds(); 
	return 0; 
}

Date.prototype.parse = function(){
	var h, m, s; 
	h = this.getHours(); 
	m = this.getMinutes(); 
	s = this.getSeconds(); 

	h>=10?(''+h):(h='0'+h); 
	m>=10?(''+m):(m='0'+m); 
	s>=10?(''+s):(s='0'+s); 

	return ('['+h+':'+m+':'+s+']').grey; 
};


let arrow = console.log.bind(console, '    >>>>> '.grey); 

let logger = function(header, arr = []){
	console.log(new Date().parse(), header);

	arr.forEach(msg => {
		if (Array.isArray(msg)){
			arrow.apply(console, msg); 
		} else {
			arrow(msg); 
		}
	})
}; 

var welcome = () => {
	console.log('\n\n\n\n/*************    Logger Ready    *************/\n'.grey)
	console.log(' use logger(Header, Arr) to log info to terminal\n'.warn)
	console.log('/**********************************************/\n\n\n\n'.grey)
}

logger.create = function(){
	var arr = Array.prototype.slice.call(arguments);
	arr.unshift(console); // as this 

	return (logger.bind).apply(logger, arr); 
}


welcome(); 
module.exports = logger; 