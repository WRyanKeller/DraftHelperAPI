// created with https://createapp.dev/webpack/
// with help from Pr. Austin Willoughby
const path = require('path');

const config = {
    entry: './client/client.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: 'bundle.js'
    },
    watchOptions: {
        aggregateTimeout: 1000,
    }
};

module.exports = config;