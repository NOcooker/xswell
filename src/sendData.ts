/**
 * 通过sendBeacon上报数据
 */

import { ReportData } from "./types";

//
function logData(url: string, data: BodyInit) {
  window.navigator.sendBeacon(url, data);
}
export const sendData = (url: string, name: string, data: ReportData): void => {
  if (!window.navigator.sendBeacon) {
    // 如果浏览器不支持sendBeacon
  } else {
    // 数据转为formdata
    const formData = new FormData();
    formData.append(name, JSON.stringify(data));
    // 页面卸载时上报数据
    window.addEventListener(
      "unload",
      () => {
        logData(url, formData);
      },
      false
    );
  }
};

export default {};
