/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState } from 'react';
import history from '@components/public/history';
import {Link} from "react-router-dom";
//本项目的模板页面

export default function Index() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Update the document title using the browser API

        return ()=>{
        }
    },[count]);

    return (
        <div>
            <Link to="/disan">去第三页</Link>
            <p>第二页</p>
        </div>
    );
}
