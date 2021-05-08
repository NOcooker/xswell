import dc from "./dataCenter";

export const getTimes = (performance: Performance): void => {
  // level 2中，timing已废弃，
  // const timing = performance.timing; // performance.timing已经被废弃，不建议使用
  const resourceTiming = performance.getEntriesByType("resource");
  const navigation = performance.getEntriesByType("navigation");

  if (resourceTiming.length > 0 && navigation.length > 0) {
    const timing1 = (resourceTiming[0] as PerformanceResourceTiming).toJSON();
    const timing2 = (navigation[0] as PerformanceNavigationTiming).toJSON();
    // ?+/ copy自 https://github.com/KieSun/per-moniteur/blob/main/src/indicator.ts，但是感觉凌乱，等弄清楚概念了再改一波

    const {
      domainLookupEnd,
      domainLookupStart,
      transferSize,
      encodedBodySize,
      connectEnd,
      connectStart,
      workerStart,
      responseEnd,
      responseStart,
      fetchStart,
      domContentLoadedEventEnd,
      domContentLoadedEventStart,
      requestStart,
      redirectCount,
    } = ({
      ...timing1,
      ...timing2,
    } as PerformanceResourceTiming) as PerformanceNavigationTiming;

    const rslt = {
      redirectCount, // 重定向次数
      dnsTime: domainLookupEnd - domainLookupStart, // dns查询耗时
      TCP: connectEnd - connectStart, //
      headSize: transferSize - encodedBodySize || 0,
      responseTime: responseEnd - responseStart,
      // Time to First Byte
      TTFB: responseStart - requestStart,
      // fetch resource time
      fetchTime: responseEnd - fetchStart,
      // Service work response time
      workerTime: workerStart > 0 ? responseEnd - workerStart : 0,
      domReady: domContentLoadedEventEnd - fetchStart,
      // html文档被完全加载和解析完成后
      DCL: domContentLoadedEventEnd - domContentLoadedEventStart,

      // FMP: 0, // 首次有效绘制（建议放弃，改用LCP）
      // FCP: 0, // 首次内容绘制
      // FP: 0, // 首次绘制 跟FCP差不多
      // TTI: 0, // 可交互时间(不好度量，放弃)
      // LCP: 0, // 最大内容渲染
      // TBT: 0, // 页面所有阻塞总时长
      // FID: 0, // 首次输入延迟(不好度量，放弃)
      // CLS: 0, // 积累布局偏移
      // L: 0, // 依赖全部加载完毕
      // SI: 0, // 显示页面可见部分的显示速度
    };
    console.log("rslt==", rslt);
    // 上报数据
    dc.reporter("timing", rslt);
  }
};

export default {};
