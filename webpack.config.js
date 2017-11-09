/**
 * Created by ALIENWARE17 on 2016/7/29.
 */
const path = require("path")
var webpack = require('webpack')

module.exports = {
	entry: {
		app: ["./index.js"]
	},
	output: {
		path: path.resolve(__dirname, "build"),
		publicPath: "/build/",
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				options: {
					presets: ["env", "react"]
				},
			}
		]
	},
	plugins: [
		// build optimization plugins
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'vendor',
		// 	filename: 'vendor-[hash].min.js',
		// }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        }),
	]
};