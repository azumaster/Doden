import React from 'react';
import NavController from './Level-two-nav.jsx';
import LevelOneNav from './Level-one-nav.jsx';
//import { connect } from 'react-redux';
//import * as action from './reduxs/actions.js';
//import { VisibilityFilters } from './reduxs/actions.js';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: null,
            levelOneMenuId: 0
        };
        this.levelOneMenuId = 0;
    }

    componentWillMount() {
        let server = H.server;
        //获取菜单;
        server.user_navigate({}, (res)=>{
            if(res.code == 0) {
                this.setState({res: res.data});
            }else if(res.code == 10106){
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            //this.props.dispatch(addTodo({phone: 'sss'}));
            //this.props.dispatch(addTodo({name: 'ass'}));
            //this.props.dispatch(addTodo({v: 'sddddd'}));
            //this.props.setState({res: res.data});
        });
    }

    setLevelOneMenuId(id) {
        this.setState({levelOneMenuId: id});
    }

    render(){
        return (
            <div>
                <LevelOneNav menu={this.state.res} handler={this.setLevelOneMenuId.bind(this)} />
                <NavController menu={this.state.res} menuId={this.state.levelOneMenuId} />
            </div>
        );
    }
}

//function selectTodos(todos, filter) {
//    //console.log(filter);
//    switch (filter) {
//        case action.VisibilityFilters.SHOW_ALL:
//            return todos;
//        case action.VisibilityFilters.SHOW_COMPLETED:
//            return todos.filter(todo => todo.completed);
//        case action.VisibilityFilters.SHOW_ACTIVE:
//            return todos.filter(todo => !todo.completed);
//    }
//}
//
//// Which props do we want to inject, given the global state?
//// Note: use https://github.com/faassen/reselect for better performance.
//function select(state) {
//    return {
//        visibleTodos: selectTodos(state.todos, state.visibilityFilter),
//        state: state.visibilityFilter
//    };
//}
//
//// 包装 components ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
//export default connect(select, action)(Main);
export default Main;
