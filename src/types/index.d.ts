/**
 * 实例化时传的配置参数
 */
export type SwellConfig = {
  collectUrl: string; // 收集数据后上报的请求地址
  env: string; // 环境变量 dev / stage / prod
  sectionArr: string[]; // 针对spa应用,需要单独监测的页面
  proName: "xswell"; // 项目名称, 默认xswell
  frame?: "vue"; // 单页面基于的框架, 默认vue
};

/**
 * 对象
 */
export type AnyObject = Record<string, unknown>;

/**
 * 函数传参
 */
export type Func = () => void;

/**
 * 报告信息
 */
export type ReportData = Record<string, any>;

export default {};
