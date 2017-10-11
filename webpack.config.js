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
		publicPath: "/assets/",
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{test: /\.js$/, loaders: ["babel"]}
		]
	}
};