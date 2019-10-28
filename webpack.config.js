const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        contentscript: './js/contentscript.js',
        contentstyle: './css/contentstyle.scss',
        eventPage: './js/eventPage.js',
        popup: './js/popup.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // 将配置项复制至dist文件夹下
        new CopyWebpackPlugin([
            { from: './public/*', to: path.resolve(__dirname, 'dist/'), flatten: true }
        ]),
        new MiniCssExtractPlugin({
            // 类似 webpackOptions.output里面的配置 可以忽略
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // 构建popup入口
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: './popup.html',
            chunks: ['popup']
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader'
                ],
            }
        ]
    }
};