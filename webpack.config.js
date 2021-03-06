/* eslint no-use-before-define:0 , no-unused-vars: 0 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const srcPath = path.join(__dirname, './src');
const stylePath = path.join(__dirname, './src/styles');
const distPath = path.join(__dirname, './dist');
const cssLoaderConfig = function(options) {
    const { useCssModule } = options;
    return {
        fallback: 'style-loader',
        use: [
            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: path.resolve('.csscache')
                }
            },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                    modules: useCssModule,
                    localIdentName: '[local]--[hash:base64:4]'
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: 'postcss.config.js'
                    }
                }
            },
            {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
                }
            }
        ]
    };
};
function webpackConfig(env) {
    const isMock = env.mock;
    const plugins = [
        new webpack.DefinePlugin({
            __MOCK__: isMock,
            'process.env': {
                NODE_ENV: isMock ? JSON.stringify('development') : JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: {
                minifyJS: true,
                minifyCSS: true,
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            asyncComponent: 'AsyncComponent'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            noParse: /node_modules/,
            options: {
                postcss: () => [
                    autoprefixer({
                        browsers: ['last 3 version']
                    })
                ]
            }
        }),
        new ExtractTextPlugin({
            filename: isMock ? '[name].css' : 'assets/vendor/[name].[chunkhash:5].css',
            allChunks: true
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
    ];
    const entry = {
        vendors: ['./src/vendors.js'],
        app: ['babel-polyfill', './src/index.jsx']
    };
    // 开发环境
    if (isMock) {
        const hotPlugins = [new webpack.NamedModulesPlugin()];
        entry.app.unshift('react-hot-loader/patch');
        plugins.push(...hotPlugins);
    } else {
        const productionPlugins = [
            new BundleAnalyzerPlugin({ openAnalyzer: false }),
            new CleanWebpackPlugin([distPath]),
            new webpack.NoEmitOnErrorsPlugin(),
            new UglifyJSPlugin({
                cache: '.uglifycache',
                sourceMap: true,
                parallel: true,
                uglifyOptions: {
                    ecma: 5,
                    output: {
                        comments: /webpackChunkName/,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        warnings: false,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true
                    }
                }
            }),
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ];
        plugins.push(...productionPlugins);
    }
    return {
        entry,
        mode: isMock ? 'development' : 'production',
        output: {
            path: distPath,
            filename: isMock ? '[name].js' : 'assets/vendor/[name].[chunkhash:5].js',
            chunkFilename: isMock ? '[name].chunk.js' : 'assets/js/[name].[chunkhash:5].chunk.js',
            publicPath: '/'
        },
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://0.0.0.0:3000/api',
                    pathRewrite: { '^/api': '' }
                }
            },
            contentBase: distPath,
            publicPath: '/',
            historyApiFallback: true,
            host: '0.0.0.0',
            port: 8181,
            disableHostCheck: true,
            https: false,
            stats: 'errors-only',
            clientLogLevel: 'error'
        },
        resolve: {
            symlinks: false,
            extensions: ['.js', '.jsx', '.less'],
            modules: ['node_modules', srcPath],
            alias: {
                react: isMock ? 'react' : nodeModulesPath('/react/umd/react.production.min.js'),
                'react-dom': isMock ? 'react-dom' : nodeModulesPath('/react-dom/umd/react-dom.production.min.js'),
                'react-router-dom': isMock
                    ? 'react-router-dom'
                    : nodeModulesPath('/react-router-dom/umd/react-router-dom.min.js'),
                redux: nodeModulesPath('/redux/dist/redux.min.js'),
                'react-redux': nodeModulesPath('/react-redux/dist/react-redux.min.js'),
                src: path.join(__dirname, 'src'),
                components: path.join(__dirname, 'src/components'),
                containers: path.join(__dirname, 'src/containers'),
                layouts: path.join(__dirname, 'src/containers/layouts'),
                common: path.join(__dirname, 'src/common'),
                reducers: path.join(__dirname, 'src/reducers'),
                scenes: path.join(__dirname, 'src/scenes'),
                services: path.join(__dirname, 'src/services'),
                utils: path.join(__dirname, 'src/utils'),
                styles: path.join(__dirname, 'src/styles'),
                AsyncComponent: path.join(__dirname, 'src/components/AsyncComponent.jsx')
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: ['eslint-loader', 'source-map-loader'],
                    enforce: 'pre',
                    exclude: /(node_modules|src\/libs|libs)/
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|src\/libs|libs)/,
                    include: srcPath,
                    use: [
                        {
                            loader: 'cache-loader',
                            options: {
                                cacheDirectory: path.resolve('.jscache')
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                extends: path.join(__dirname, '.babelrc')
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.less$/,
                    include: stylePath,
                    use: isMock
                        ? ['style-loader', ...cssLoaderConfig({ useCssModule: false }).use]
                        : ExtractTextPlugin.extract(cssLoaderConfig({ useCssModule: false })),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.less$/,
                    include: /(src\/scenes|src\/components)/,
                    use: isMock
                        ? ['style-loader', ...cssLoaderConfig({ useCssModule: true }).use]
                        : ExtractTextPlugin.extract(cssLoaderConfig({ useCssModule: true })),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.(woff|woff2|ttf|eot)(\?]?.*)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: { limit: 8192, name: 'assets/fonts/[name].[ext]?[hash:5]' }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    include: srcPath,
                    exclude: /(fonts)/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                limit: 8124,
                                name: 'assets/images/[name].[hash:5].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        resolveLoader: {
            moduleExtensions: ['-loader']
        },
        externals: {
            moment: true
        },
        plugins,
        optimization: {
            occurrenceOrder: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        // test: /[\\/]node_modules[\\/]/,
                        test: 'vendors',
                        priority: 10,
                        enforce: true,
                        name: 'vendors',
                        chunks: 'all',
                        minChunks: 1,
                        minSize: 0,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        performance: {
            hints: false
        },
        cache: true,
        watch: false,
        devtool: isMock ? 'source-map' : false
    };
}

function nodeModulesPath(filePath) {
    return path.join(__dirname, 'node_modules', filePath);
}

module.exports = webpackConfig;
