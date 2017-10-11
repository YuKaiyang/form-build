/**
 * Created by ALIENWARE17 on 2016/7/29.
 */
const path = require("path")

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
	}
};