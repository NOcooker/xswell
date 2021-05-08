import resolve from "@rollup/plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify"; // 只支持ES5, 注意用结构式取uglify方法，否则会报错
import { minify } from "uglify-es";
import pkg from "./package.json";

export default {
  input: "./lib/index.js",
  output: {
    name: "xswell",
    file: pkg.main,
    format: "umd",
  },
  plugins: [
    resolve(), // 解析import引入
    uglify({}, minify), // 压缩代码
  ],
};
