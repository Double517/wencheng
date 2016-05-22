/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import { render } from 'react-dom';
import { hashHistory, Router } from 'react-router';
import 'weui';
import routes from './config/routes';

if (__DEBUG__) {
    const vConsole = require('./util/vconsole.min.js');
}

// browserHistory 需要server支持, 将所有的url都转发到index.html 暂时略过
//render(<Router history={browserHistory} routes={routes}/>, document.getElementById('container'));
render(<Router history={hashHistory} routes={routes}/>, document.getElementById('container'));