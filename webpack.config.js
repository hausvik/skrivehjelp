/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const urlDev = "https://ds.app.uib.no/add-in/dev/";
const urlProd = "https://ds.app.uib.no/add-in/prod/";

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: "./src/taskpane/taskpane.ts",
      arbeidsavtalepane: "./src/arbeidsavtalepane/arbeidsavtalepane.ts",
      commands: "./src/commands/commands.ts",
    },
    output: {
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/taskpane/taskpane.html",
        chunks: ["taskpane"],
        filename: "taskpane.html",
      }),
      new HtmlWebpackPlugin({
        template: "./src/arbeidsavtalepane/arbeidsavtalepane.html",
        chunks: ["arbeidsavtalepane"],
        filename: "arbeidsavtalepane.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "manifest*.xml",
            to: "[name][ext]",
            transform(content, path) {
              // Check if the file is the production manifest
              if (path.includes('manifest-prod.xml')) {
                // Replace with production URL
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              } else if (path.includes('manifest-dev.xml')) {
                // Replace with development URL (if needed)
                return content.toString().replace(new RegExp(urlProd, "g"), urlDev);
              }
              return content; // Return the content unmodified if it doesn't match
            }
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },

      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};
