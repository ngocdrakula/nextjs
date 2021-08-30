import React, { Component } from 'react'
import { connect } from 'react-redux'
import types from '../../redux/types';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleSubmit = e => {
        e.preventDefault();
        const { email, password } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_LOGIN,
            payload: { email, password },
            callback: data => {
                console.log(data)
                if (!data?.success) {
                    this.setState({ message: data?.message || 'Vui lòng kiểm tra kết nối internet' })
                }
            }
        })
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' })
    render() {
        const { message } = this.state;
        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <a href="/">Virtual Autotech</a>
                    </div>
                    <div className="box login-box-body">
                        <div className="box-header with-border">
                            <h3 className="box-title">Login</h3>
                        </div>
                        <div className="box-body">
                            <form method="POST" action="/login" onSubmit={this.handleSubmit}>
                                <div className={"form-group has-feedback" + (message ? " has-error" : "")}>
                                    <input className="form-control input-lg" placeholder="Email address" required name="email" type="email" onChange={this.handleChange} />
                                    <span className="glyphicon glyphicon-envelope form-control-feedback glyphicon-ok" />
                                    <div className="help-block with-errors">
                                        {message ?
                                            <ul className="list-unstyled">
                                                <li>{message}</li>
                                            </ul>
                                            : ""
                                        }
                                    </div>
                                </div>
                                <div className={"form-group has-feedback" + (message ? " has-error" : "")}>
                                    <input className="form-control input-lg" placeholder="Password" onChange={this.handleChange} required name="password" type="password" defaultValue />
                                    <span className="glyphicon glyphicon-lock form-control-feedback glyphicon-ok" />
                                    <div className="help-block with-errors">
                                        {message ?
                                            <ul className="list-unstyled">
                                                <li>{message}</li>
                                            </ul>
                                            : ""
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-7">
                                        <div className="form-group">
                                            <label>
                                                <div className="icheckbox_minimal-blue" aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                    <input className="icheck" name="remember" type="checkbox" style={{ position: 'absolute', opacity: 0 }} />
                                                    <ins className="iCheck-helper" style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }} />
                                                </div> Remember Me
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-xs-5">
                                        <input className="btn btn-block btn-lg btn-flat btn-primary" type="submit" defaultValue="Login" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <a className="btn btn-link" href={"/password/reset"}>Quên mật khẩu?</a>
                        <a className="btn btn-link" href={"/register"}>Đăng ký</a>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(({ }) => ({}))(Login)
