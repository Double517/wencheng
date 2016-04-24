/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Router, Route, IndexRoute} from 'react-router';
// import WeUI from '../src/index';
import WeUI from 'react-weui';
import 'weui';

import Home from './pages/home/index';

import Bind from './pages/bind/index';
import ClassSchedule from './pages/class_schedule/index';



class App extends React.Component {
        render() {
                return (
                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="page"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                        style={{height: '100%'}}
                    >
                            {React.cloneElement(this.props.children, {
                                    key: this.props.location.pathname
                            })}
                    </ReactCSSTransitionGroup>
                );
        }
}

ReactDOM.render((
    <Router>
            <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="bind" component={Bind}/>
                    <Route path="class_schedule" component={ClassSchedule}/>
            </Route>
    </Router>
), document.getElementById('container'));
