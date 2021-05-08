import dc from "./dataCenter";
import { doMO } from "./mutationObserver";
import { pageItem, PagesTimes } from "./types/pages.d";

interface customizedEvent extends Event {
  targetUrl: string;
}

/**
 * 判断是否已有数据
 */
const dataIsNotExist = (key: string): boolean => {
  return !dc.receiptor(key);
};

/**
 * 自定义pushState事件:https://github.com/gdutwyg/blog/issues/70
 */
/* eslint func-names: "off" */
(function () {
  function newEvent(type: "pushState" | "replaceState") {
    const fn = window.history[type];
    return function () {
      const e = new Event(type) as customizedEvent;
      e["targetUrl"] = { ...arguments }[2]; // 往事件对象里插入要跳转到的url地址，解决事件回调里拿不到目标地址的情况
      // 触发自定义事件
      window.dispatchEvent(e);
      /* eslint prefer-rest-params: "off" */
      // @ts-ignore
      return fn.call(this, ...arguments);
    };
  }
  window.history.pushState = newEvent("pushState");
  window.history.replaceState = newEvent("replaceState");
})();

/**
 * 给页面添加mutationObserver监听
 * @param pages 子页路由
 * @param targetPath 当前url地址
 */
export const logPageTime = (pages: string[], targetPath: string): void => {
  // 获取一个开始时间
  const startTime = performance.now();
  let curPath = "";
  // 判断当前路由是哪个子路由，然后为他开启dom变更监听
  if (targetPath.indexOf(curPath) < 0) {
    for (let i = 0; i < pages.length; i++) {
      const reg = new RegExp(`${pages[i]}`, "i");
      if (reg.test(targetPath)) {
        curPath = pages[i];
        break;
      } else {
        curPath = "/FMP";
      }
    }
  }

  // 数据池中还没有当前页面的首次进入的数据
  if (dataIsNotExist(`/page${curPath}`)) {
    doMO(startTime).then((rslt: PagesTimes) => {
      // 获取每次dom变化中耗时最大的（不严谨，可能这个dom的权重不高）
      const fmp = rslt.sort((a, b) => {
        return b.fmp - a.fmp;
      })[0].fmp;
      // 合并所有dom变动中涉及的ajax请求的时间
      const allReqs = rslt.reduce((total: any[], item: pageItem) => {
        return total.concat(item.reqs);
      }, []);
      // 存在说不同的dom变化存在于同一个时间段内，导致获取的reqs数据重复
      const tmpT: number[] = [];
      const reqs = allReqs.reduce((total, item) => {
        if (!tmpT.includes(item.time)) {
          tmpT.push(item.time);
          total.push(item);
        }
        return total;
      }, []);
      dc.reporter(`/page${curPath}`, {
        fmp,
        reqs,
      });
    });
  } else {
    // 已经有数据了，直接返回全部
    dc.logger();
  }
};

export const pageObserver = (pages: string[]): void => {
  /**
   * 监听多个事件
   */
  window.addEventListener("replaceState", (e) => {
    logPageTime(pages, (e as customizedEvent)["targetUrl"]);
  });
  window.addEventListener("pushState", (e) => {
    logPageTime(pages, (e as customizedEvent)["targetUrl"]);
  });
  // 路由监听每次子路由变动
  window.addEventListener("hashchange", () => {
    logPageTime(pages, window.location.href);
  });
};

export default {};
