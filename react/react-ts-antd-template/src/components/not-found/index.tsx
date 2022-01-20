import React, { useState, useEffect } from 'react';
import { Blank } from '@/components';
import './index.less';

const NotFound: React.FC = (props: any) => {
  return (
    <div className="not-found-page">
      <Blank />
    </div>
  );
};

export default NotFound;
