const path = require("path");
module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: []
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "csb-9qn3q" : "/"
};
