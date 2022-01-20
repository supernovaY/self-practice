/**
 * context 方法来设置项目全局变量
 */
import React from 'react';

// 一些初始的全局变量
export const globalValues: any = {
  name: 'myGlobalValues',
};

export const GlobalContext = React.createContext(globalValues);

// 参考链接:
// https://zh-hans.reactjs.org/docs/context.html#caveats
// https://react.js.org/docs/context.html
