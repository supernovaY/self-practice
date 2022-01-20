import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
// import NotFound from '@/components/not-found';
import Routers, { RouteIns } from '@/router';
import RouteGuard from './route-guard';

const Content: React.FC = () => {
  return (
    <Suspense fallback={<div>页面加载中</div>}>
      <Switch>
        {Routers.map((page: RouteIns, index: number) => {
          return (
            <Route
              key={index}
              exact
              path={page.path}
              // <page.component {...props} meta={{ ...page.meta, pageName: page.name }} route={page} />
              render={(props) => <RouteGuard {...props} pagename={page.name} meta={{ ...page.meta }} route={page} />}
            />
          );
        })}
        {/* <Route key="notFound" component={NotFound} /> */}
      </Switch>
    </Suspense>
  );
};

export default Content;
