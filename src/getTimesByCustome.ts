import { AnyObject, Func } from "./types/index.d";

/**
 * 自定义获取时间值
 * @param tag 当前要监听的页面组件名称
 * @param period 阶段名称 or 方法名称
 * @param cb 要计时的方法
 */
export const getCustomeTimes = (
  tag: string,
  cb: Func,
  period?: string
): AnyObject => {
  // 需要改动
  let times = {};
  const measureName = `measure${tag} ${period}`;
  const startTag = `start${tag}`;
  const endTag = `end${tag}`;

  performance.mark(startTag);
  // 要计时的方法
  cb();
  performance.mark(endTag);
  performance.measure(measureName, startTag, endTag);

  times = performance.getEntriesByName(measureName)[0];
  console.log("这次测量的数据：", times);
  return times;
};

export default {};
