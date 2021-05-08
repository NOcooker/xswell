// 当前元素是否需要统计分数,判断条件：在可视区域内，宽高不为0，可见
const needCalcScore = (dom: Element): boolean => {
  const rect = dom.getBoundingClientRect();
  const { display, opacity, visibility } = window.getComputedStyle(dom);
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  return (
    rect.left < screenW &&
    rect.top < screenH &&
    rect.right - rect.left > 0 &&
    rect.bottom - rect.top > 0 &&
    display !== "none" &&
    opacity !== "0" &&
    visibility !== "hidden"
  );
};

// 考虑权重，计算此次dom变动得分
const calcWeightScore = (dom: Element, initScore = 0): number => {
  // 计算当前节点分数
  let thatDomScore = initScore;
  // 算分逻辑: 直接 元素的宽高相乘
  if (needCalcScore(dom)) {
    const { clientLeft, clientTop, clientWidth, clientHeight } = dom;
    const { innerWidth, innerHeight } = window;
    // 考虑到元素部分展示在可视区内的情况
    const viewW =
      clientLeft + clientWidth > innerWidth
        ? innerWidth - clientLeft
        : clientWidth;
    const viewH =
      clientTop + clientHeight > innerHeight
        ? innerHeight - clientTop
        : clientHeight;
    thatDomScore += viewW * viewH;
  }
  // 递归加子节点的分数
  if (!needCalcScore(dom) || dom.children.length === 0) {
    return thatDomScore;
  } else {
    for (let i = 0; i < dom.children.length; i++) {
      // 计算当前子节点的得分
      thatDomScore += calcWeightScore(dom.children[i], thatDomScore);
    }
    return thatDomScore;
    // return dom.childNodes.reduce((total: number, child: Element) => {
    //   // 计算当前子节点的得分
    //   total += calcWeightScore(child, total);
    //   return total;
    // }, thatDomScore);
  }
};

/**
 * 算分数的逻辑
 * 递归节点，进行分数累加
 */
const ignoreEleList = ["script", "style", "link", "br"]; // 忽略的节点
let result = 0; // 最后的记分
const calcScore = (mutation: MutationRecord): number => {
  // 没有新增元素就计0分
  if (!mutation || !mutation.addedNodes) return 0;
  // 先遍历新增的dom节点
  mutation.addedNodes.forEach((dom) => {
    if (
      dom.nodeType === 1 &&
      ignoreEleList.indexOf(dom.nodeName.toLocaleLowerCase()) < 0 &&
      needCalcScore(dom as Element) // 强制转化有点问题
    ) {
      result += calcWeightScore(dom as Element);
    }
  });
  return result;
};

export default calcScore;
