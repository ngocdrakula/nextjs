import React, { Component } from 'react'
import { connect } from 'react-redux'
import Login from '../components/User/Login';
import Header from '../components/Header';
import Register from '../components/User/Register';
import types from '../redux/types';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_GET_SETTING, });
    }

    handleSelect = (e, isRegister) => {
        e.preventDefault();
        this.setState({ isRegister })
    }
    render() {
        const { isRegister } = this.state;
        const { user } = this.props;
        return (
            <div id="app" className="user-page">
                <Header handleSelect={this.handleSelect} />
                {user ?
                    <i>aaa</i>
                    : isRegister === 'register' ?
                        <Register handleSelect={this.handleSelect} />
                        :
                        <Login handleSelect={this.handleSelect} />
                }
            </div>
        )
    }
}


export default connect(({ user: { user } }) => ({ user }))(Home)
