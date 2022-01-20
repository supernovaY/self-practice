import React from 'react';
import './index.less';

const Blank: React.FC = (props: any): JSX.Element => {
  const { imgURL = '', tips = '' } = props.children || {};
  return (
    <div className="blank-container">
      <div className="blank-content">
        <div>
          <img src={imgURL || require('@/assets/img/react_logo512.png')} alt="" />
          <br /> <br />
          <p>{tips || '系统还在构建中，敬请期待'}</p>
        </div>
      </div>
    </div>
  );
};

export default Blank;
