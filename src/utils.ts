import { AnyObject } from "./types";

/**
 * 获取两个数组中的不同项， https://juejin.cn/post/6844903789456015374
 * @param arr1
 * @param arr2
 * 写死的key值！还要改
 */
export const getDiffItems = (array1: any[], array2: any[]): AnyObject[] => {
  // 定义一个空数res组作为返回值的容器，基本操作次数1。
  const res: any[] = [];
  // 定义一个对象用于装数组一的元素，基本操作次数1。
  const objectA: AnyObject = {};
  // 使用对象的 hash table 存储元素，并且去重。基本操作次数2n。
  for (const ele of array1) {
    let name = null;
    if (typeof ele !== "object") {
      name = ele;
    } else {
      name = `${ele.name}@@${ele.startTime}`;
    }
    // 取出n个元素n次
    objectA[name] = ele; // 存入n个元素n次
  }
  // 定义一个对象用于装数组二的元素，基本操作次数1。
  const objectB: AnyObject = {};
  // 使用对象的 hash table 存储元素，并且去重。基本操作次数2n。
  for (const ele of array2) {
    let name = null;
    if (typeof ele !== "object") {
      name = ele;
    } else {
      name = `${ele.name}@@${ele.startTime}`;
    }
    // 取出n个元素n次
    objectB[name] = ele; // 存入n个元素n次
  }
  // 使用对象的 hash table 删除相同元素。基本操作次数4n。
  for (const key in objectA) {
    // 取出n个key (n次操作)
    if (key in objectB) {
      // 基本操作1次 (外层循环n次)
      delete objectB[key]; // 基本操作1次 (外层循环n次)
      delete objectA[key]; // 基本操作1次 (外层循环n次)（总共是3n 加上n次取key的操作 一共是4n）
    }
  }
  // 将第一个对象剩下来的key push到res容器中，基本操作次数是3n次(最糟糕的情况)。
  for (const key in objectA) {
    // 取出n个元素n次(最糟糕的情况)。
    res[res.length] = objectA[key]; // 读取n次length n次，存入n个元素n次，一共2n(最糟糕的情况)。
  }
  // 将第二个对象剩下来的key push到res容器中，基本操作次数也是3n次(最糟糕的情况)。
  for (const key in objectB) {
    // 取出n个元素n次(最糟糕的情况)。
    res[res.length] = objectB[key]; // 读取n次length n次，存入n个元素n次，一共2n(最糟糕的情况)。
  }
  // 返回结果，基本操作次数1。
  return res;
};

export default {};
