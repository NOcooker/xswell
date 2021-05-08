import { SwellConfig } from "./types/index.d";
import { getTimes } from "./getTimes";
// import { getTimesByMark } from "./getTimesByMark";
// import { getCLS, getFCP, getLCP } from "./observe";
import { sendData } from "./sendData";
// import { getCustomeTimesBase } from "./getTimesByCustome";
import { PagesTimes, GlobalTimes } from "./types/pages.d";
import dc from "./dataCenter";
import { logPageTime, pageObserver } from "./pageObserver";

const performance = window.performance;

export default class XSwell {
  public config: SwellConfig; // 配置项
  public globalTimes: GlobalTimes = {}; // 获取页面首次进入时的性能数据
  public pagesTimes: PagesTimes = []; // 存储所以子页面信息（包括：首屏时间，请求时间）
  // protected: 可被继承，不可被外部访问
  protected performance = window.performance;
  constructor(args: SwellConfig) {
    this.config = args;
    if (!performance) {
      console.warn("[oh god!] 你的设备不支持window.performance API !");
      return;
    }

    /**
     * 如果是开发环境，每次上报资料时打印数据
     */
    if (this.config.env === "dev") {
      dc.checkEnv(this.config.env);
    }

    /**
     * 项目初始化的时候获取首屏数据
     */
    logPageTime(this.config.sectionArr, window.location.href);

    /**
     * 获取子页面的数据,开始监听
     */
    this.getPageTimes();

    /**
     * 获取基础的数据
     */
    getTimes(this.performance);

    /**
     * 获取某些重要的数据信息，chrome浏览器记录的新指标
     */
    // getCLS();
    // getFCP();
    // getLCP();

    /**
     * 上传数据（何时上传？）
     */
    if (args.collectUrl) {
      sendData(args.collectUrl, this.config.proName, dc.receiptor());
    }
  }

  /**
   * 用于记录某spa应用子路由的性能信息
   * 基于mutationObserver, 在应用加载是就开始监听dom，监听一次以后就会关闭
   */
  private getPageTimes() {
    pageObserver(this.config.sectionArr);
  }
}
