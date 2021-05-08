import { AnyObject } from "./index";

// 每个子页面包含的 信息
export type pageItem = {
  fmp: number; // 首屏时间
  reqs: ReqSpend[];
};
// 每条请求的信息
type ReqSpend = {
  url: string;
  time: number;
};

export type PagesTimes = pageItem[];

/**
 * 页面所有dom变化数组项的结构
 */
export type ScoreTime = {
  score: number;
  time: number;
};

/**
 * 页面首次进入时的性能数据
 */
export type GlobalTimes = AnyObject;
