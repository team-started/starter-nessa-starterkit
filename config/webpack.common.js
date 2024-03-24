const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { resolve } = require('path');

const { DIR, DEV, BUILD, RESOLVER, isDevelopment } = require('./settings');
const assetsFolder = isDevelopment ? `${BUILD.assetsFolder}/` : '';

module.exports = {
    // Where webpack looks to start building the bundle
    entry: {
        app: [
            `${DIR.src}/${BUILD.assetsFolder}/JavaScript/app.js`,
            `${DIR.src}/${BUILD.assetsFolder}/Sass/app.scss`,
        ],
        rte: [`${DIR.src}/${BUILD.assetsFolder}/Sass/rte.scss`],
    },

    // Where webpack outputs the assets and bundles
    output: {
        path: BUILD.dist,
        filename: `${assetsFolder}${BUILD.jsFolder}/[name].min.js`,
    },

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            { test: /\.js$/, use: ['babel-loader'] },
            {
                // TODO: Muss svg für sich stehen?
                // https://dev.to/smelukov/webpack-5-asset-modules-2o3h
                test: /\.(?:ico|gif|png|jpg|jpeg|svg|)$/i,
                type: 'asset/resource',
                generator: {
                    filename: BUILD.hashAssets
                        ? `${assetsFolder}${BUILD.imageFolder}/[name].[hash][ext]`
                        : `${assetsFolder}${BUILD.imageFolder}/[name][ext]`,
                },
            },

            // Fonts
            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                type: 'asset/resource',
                generator: {
                    filename: BUILD.hashAssets
                        ? `${assetsFolder}${BUILD.fontFolder}/[name].[hash][ext]`
                        : `${assetsFolder}${BUILD.fontFolder}/[name][ext]`,
                },
            },
        ],
    },

    // Customize the webpack build process
    plugins: [
        // Images: Copy image files to build folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: DIR.images,
                    to: resolve(BUILD.assets, BUILD.imageFolder),
                },
            ],
        }),
        new ESLintPlugin(),
        new StylelintPlugin(),
        // Removes/cleans build folders and unused assets when rebuilding
        // new CleanWebpackPlugin(),
        // TODO: Nicht sicher, ob das hier noch gebraucht wird
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     isotope: 'isotope-layout',
        // }),
        new WebpackBar(isDevelopment ? DEV.barOption : BUILD.barOption),
    ],

    resolve: {
        alias: {
            ...RESOLVER,
        },
        extensions: ['*', '.js', '.vue', '.json'],
        modules: [DIR.npmPackages, DIR.src, DIR.assets],
    },
};
