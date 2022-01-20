import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// 路由守卫组件
const RouteGuard = (props: any) => {
  const onPageEnter = () => {
    console.log(`%c 进入路由页面: ${props.route.name}`, 'color: blue;font-size: 16px');
    console.log('props:', props);
  };

  const onPageLeave = () => {
    console.log(`%c 离开路由页面: ${props.route.name}`, 'color: red;font-size: 16px');
  };

  useEffect(() => {
    onPageEnter();
    return () => {
      onPageLeave();
    };
  }, []);

  return <props.route.component {...props} />;
};

export default withRouter(RouteGuard);
