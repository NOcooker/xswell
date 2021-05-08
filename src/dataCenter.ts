import { csl } from "./logger";
import { AnyObject, ReportData } from "./types/index.d";
import { pageItem } from "./types/pages.d";

class DataCenter {
  public dataPool: ReportData;
  private env: string;
  constructor(initData: AnyObject, env: "prod") {
    this.dataPool = initData;
    this.env = env;
  }
  /**
   * 切换环境
   */
  public checkEnv(env: string) {
    this.env = env;
  }
  /**
   * 上报信息
   * @param key 信息名称
   * @param data 信息数据
   */
  public reporter(key: string, data?: AnyObject | pageItem | string | number) {
    // data有数据才存入
    if (data && Object.keys(data).length > 0) {
      this.dataPool[key] = data;
    }
    // 如果是开发环境，每次上报打印一下数据
    if (this.env === "dev") csl(this.dataPool);
  }

  /**
   * 获取当前获取的所有数据
   * @param key 信息名称
   * @returns 信息数据
   */
  public receiptor(key?: string) {
    if (key) {
      return this.dataPool[key];
    } else {
      return this.dataPool;
    }
  }

  /**
   * 打印数据
   * @param key 信息名称
   * @returns 信息数据
   */
  public logger(key?: string) {
    if (this.env === "dev") {
      if (key) {
        csl(this.dataPool[key]);
      } else {
        csl(this.dataPool);
      }
    }
  }
}

const dc = new DataCenter({}, "prod");

export default dc;
