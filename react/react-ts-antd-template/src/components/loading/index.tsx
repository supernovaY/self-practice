import React from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

class Loading {
  domNode: HTMLElement;
  isExistNode: boolean;
  constructor() {
    this.domNode = document.createElement('div');
    this.isExistNode = false;
  }
  private render(visible: boolean) {
    if (visible && !this.isExistNode) {
      document.body.appendChild(this.domNode);
      const node = (
        <>
          <div className="loading-mask"></div>
          <div className="loading-contain">
            <Spin indicator={antIcon} />
            <p className="loading-contain__text">加载中...</p>
          </div>
        </>
      );
      ReactDOM.render(node, this.domNode);
      this.isExistNode = true;
    }
    this.domNode.className = visible ? 'loading-show' : 'loading-hide';
  }
  show() {
    this.render(true);
  }
  hide() {
    this.render(false);
  }
}

export default new Loading();
