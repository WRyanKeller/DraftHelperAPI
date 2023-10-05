// created with https://createapp.dev/webpack/
// with help from Pr. Austin Willoughby
const path = require('path');

const config = {
    entry: './src/server.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: 'bundle.js'
    },
    watchOptions: {
        aggregateTimeout: 1000,
    }
};

module.exports = config;