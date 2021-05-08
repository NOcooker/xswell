module.exports = {
  parser: "@typescript-eslint/parser", // 定义ESLint的解析器
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ], // 定义文件继承的子规范
  plugins: ["@typescript-eslint"], // 定义了该eslint文件所依赖的插件
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/ban-ts-comment": "off",
  },
  env: {
    // 指定代码的运行环境
    browser: true,
    node: true,
  },
};