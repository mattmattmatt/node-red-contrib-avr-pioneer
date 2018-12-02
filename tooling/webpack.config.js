const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyPlugin = new CopyWebpackPlugin([{ from: './*.html' }], {
    copyUnmodified: false,
});

module.exports = {
    mode: 'development',
    entry: {
        'pioneer-avr-out': './pioneer-avr-out.js',
        // 'pioneer-avr-state': './pioneer-avr-state.js',
        'pioneer-avr-config': './pioneer-avr-config.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'eslint-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [copyPlugin],
    externals: /^[^.]/,
};
