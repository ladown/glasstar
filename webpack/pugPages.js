const fs = require('fs');
const paths = require('./paths');

const pugPages = () =>
	fs.readdirSync(`${paths.pug}`).filter((file) => {
		return file.endsWith('.pug');
	});

module.exports = pugPages;
