import React, { Component } from 'react'
import { connect } from 'react-redux'
import types from '../../redux/types';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidUpdate(prevProps) {
        const { message } = this.props;
        if (message && message !== prevProps.message) {
            this.setState({ message });
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        const { username, password } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_LOGIN,
            payload: { username, password }
        })
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' })
    render() {
        return (
            <div className="wrapper wrapper-login fadeInDown">
                <div id="formContent">
                    <div className="fadeIn first" style={{ padding: '12px 0px' }}>
                        <h3>Đăng nhập</h3>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <span style={{}}>{this.state.message}</span>
                        <input type="text" className="fadeIn second" name="username" placeholder="Tài khoản" onChange={this.handleChange} />
                        <input type="password" className="fadeIn third" name="password" placeholder="Mật khẩu" onChange={this.handleChange} />
                        <input type="submit" className="fadeIn fourth" value="Đăng nhập" />
                    </form>
                    {/* <div id="formFooter">
                        <a className="underlineHover" href="#">Forgot Password?</a>
                    </div> */}
                </div>
            </div>

        )
    }
}


export default connect(({ admin: { message } }) => ({ message }))(Login)
