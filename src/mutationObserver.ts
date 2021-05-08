import { PagesTimes, ReqSpend, ScoreTime } from "./types/pages.d";
import calcScore from "./calcScore";
import { getDiffItems } from "./utils";
/**
 * 单例模式，确保只有一个mutationObserve实例，要不要在页面退出时清理内存？
 */
const moInstance = (() => {
  let singleInstance: MutationObserver;
  return (cb: MutationCallback) => {
    // if (singleInstance) return singleInstance;
    singleInstance = new MutationObserver(cb);
    return singleInstance;
  };
})();

/**
 * 通过遍历所有存储dom变化的信息，算出首屏时间
 */
const calcFMP = (data: ScoreTime[]) => {
  // 取得分最高的dom变化对应的时间点
  return data.sort((a, b) => {
    return b.score - a.score;
  })[0].time;
  // 如果得分相同呢？取耗时最长的
};

/**
 * 获取当前页面静态资源所消耗的时间
 */
const getHttpsTimes = (
  resourceArr: PerformanceResourceTiming[]
): ReqSpend[] => {
  const rslt: ReqSpend[] = [];
  resourceArr.forEach((rsc) => {
    // 目前只涉及Ajax请求
    if (rsc.initiatorType === "xmlhttprequest") {
      rslt.push({
        url: rsc.name,
        time: rsc.responseEnd - rsc.fetchStart,
      });
    }
  });
  return rslt;
};

/**
 * 计算最终结果
 * @param data 子页面所以dom变动的信息
 * @param rscData 静态资源的数据
 */
const calcFinallInfo = (
  data: ScoreTime[],
  rscData: PerformanceResourceTiming[]
) => {
  // 计算首屏时间
  let fmp = calcFMP(data);
  // 再根据当前页面的resource中图片的加载时间，算出最终的fmp。如果图片在当前fmp内开始加载，在fmp外加载结束，就取图片的加载时间
  rscData.forEach((rsc) => {
    if (
      rsc.initiatorType === "img" &&
      rsc.fetchStart < fmp &&
      rsc.responseEnd > fmp
    ) {
      fmp = rsc.responseEnd;
    }
  });
  // 遍历完也说明页面上的异步操作也结束了
  const reqs = getHttpsTimes(rscData);
  return {
    fmp,
    reqs,
  };
};

export const doMO = (startTime: number): Promise<PagesTimes> => {
  const asyncArr: PagesTimes | PromiseLike<PagesTimes> = []; // 存储异步promise,包含这次子路由上所有元素变动的信息
  const pageRslt: ScoreTime[] = [];
  let rscStart = performance.getEntriesByType("resource");

  return new Promise<PagesTimes>((resolve) => {
    // 节点变动时的回调函数
    const callback: MutationCallback = (list: MutationRecord[]) => {
      // 遍历每次dom节点的变化
      for (const item of list) {
        // 当前变化的dom节点（不论是他自己还是他的子孙元素）
        const scoreTime = {
          score: calcScore(item), // dom变化对应权重分
          time: performance.now() - startTime, // dom变化耗时
        };
        pageRslt.push(scoreTime);
      }
      // 遍历了所有dom变动，再次统计PerformanceResourceTiming，因为是个累加的过程，所以取多出的项
      const rscEnd = performance.getEntriesByType("resource");
      // const rscRslt = rscEnd.length - rscStartLen ? rscEnd.slice(-(rscEnd.length - rscStartLen)) : [];
      const rscRslt = getDiffItems(rscStart, rscEnd);
      rscStart = rscEnd; // 重置起始的资源，防止重复数据

      asyncArr.push(
        calcFinallInfo(
          pageRslt,
          (rscRslt as unknown) as PerformanceResourceTiming[]
        )
      );
    };

    // 创建实例
    const observer = moInstance(callback);

    // 开始观察目标节点 body
    observer.observe(document.body, {
      /* attributes: true, */
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(asyncArr);
    }, 5000);
  });
};

export default {};
