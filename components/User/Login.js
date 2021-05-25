import React, { Component } from 'react'
import { connect } from 'react-redux'
import types from '../../redux/types';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' });
    handleSubmit = e => {
        e.preventDefault();
        const { email, password } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: types.USER_LOGIN,
            payload: { username: email, password },
            callback: res => {
                if (!res?.success) {
                    this.setState({ message: res?.message || 'Sai email hoặc mật khẩu' })
                }
            }
        })
    }

    render() {
        const { message } = this.state;
        const { handleSelect } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="panel panel-default">
                            <div className="panel-heading">Login</div>
                            <div className="panel-body">
                                <form role="form" method="POST" action="/login" className="form-horizontal" onSubmit={this.handleSubmit}>
                                    <div className={"form-group" + (message ? " has-error" : "")}>
                                        <label htmlFor="email" className="col-md-4 control-label">E-Mail Address</label>
                                        <div className="col-md-6">
                                            <input id="email" type="email" name="email" required="required" autoFocus="autofocus" className="form-control" onChange={this.handleChange} />
                                            {message ? <span className="help-block"><strong>{message}</strong></span> : ''}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="col-md-4 control-label">Password</label>
                                        <div className="col-md-6">
                                            <input id="password" type="password" name="password" required="required" className="form-control" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-md-6 col-md-offset-4">
                                            <div className="checkbox">
                                                <label><input type="checkbox" name="remember" />Remember Me</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-md-8 col-md-offset-4">
                                            <button type="submit" className="btn btn-primary">Login</button>
                                            <a href="/register" className="btn btn-default" style={{ marginLeft: 5 }} onClick={e => handleSelect(e, 'register')}> Register</a>
                                        </div>
                                    </div>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <a href="/login/google" title="Google" className="btn btn-google"><img src="/icons/google.png" alt="Google" /> Login with Google</a>
                                    <a href="/login/facebook" title="Facebook" className="btn btn-facebook"><img src="/icons/facebook.png" alt="Facebook" /> Login with Facebook</a>
                                    <a href="/login/twitter" title="Twitter" className="btn btn-twitter"><img src="/icons/twitter.png" alt="Twitter" /> Login with Twitter</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(() => ({}))(Login)
