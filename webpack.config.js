const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    node: {
        Buffer: false,
        __dirname: false,
        __filename: false,
        console: true,
        global: true,
        process: false
    },
    output: {
        libraryTarget: "commonjs2",
        filename: 'movement.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { loader: 'ts-loader' }
        ]
    }
};
