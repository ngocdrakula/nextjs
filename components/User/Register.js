import React, { Component } from 'react'
import { connect } from 'react-redux'
import types from '../../redux/types';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'ngocdrakula@gmial.cas',
            name: 'asasasa',
            password: '11111111',
            repassword: '11111111'
        };
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '', field: '' });
    handleSubmit = e => {
        e.preventDefault();
        const { name, email, password, repassword } = this.state;
        const { dispatch } = this.props;
        if (password?.length < 8) {
            this.setState({ field: 'password', message: 'Mật khẩu phải trên 8 kí tự' });
        }
        else if (password !== repassword) {
            this.setState({ field: 'repassword', message: 'Mật khẩu xác nhận sai' });
        }
        else {
            this.setState({ submited: true })
            dispatch({
                type: types.USER_REGISTER,
                payload: { username: email, password, name },
                callback: res => {
                    if (res?.success) {
                        this.setState({
                            message: res?.message || 'Địa chỉ email đã được sử dụng',
                            field: 'email',
                            submited: false
                        });
                    }
                }
            })
        }
    }

    render() {
        const { message, field, submited } = this.state;
        const { handleSelect } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="panel panel-default">
                            <div className="panel-heading">Register</div>
                            <div className="panel-body">
                                <form role="form" method="POST" action="/register" className="form-horizontal" onSubmit={this.handleSubmit}>
                                    <div className={"form-group" + (field === 'name' ? " has-error" : "")}>
                                        <label htmlFor="name" className="col-md-4 control-label">Name</label>
                                        <div className="col-md-6">
                                            <input id="name" type="text" name="name" required="required" autoFocus="autofocus" className="form-control" onChange={this.handleChange} />
                                            {field === 'name' ? <span className="help-block"><strong>{message}</strong></span> : ''}
                                        </div>
                                    </div>
                                    <div className={"form-group" + (field === 'email' ? " has-error" : "")}>
                                        <label htmlFor="email" className="col-md-4 control-label">E-Mail Address</label>
                                        <div className="col-md-6">
                                            <input id="email" type="email" name="email" required="required" className="form-control" onChange={this.handleChange} />
                                            {field === 'email' ? <span className="help-block"><strong>{message}</strong></span> : ''}
                                        </div>
                                    </div>
                                    <div className={"form-group" + (field === 'password' ? " has-error" : "")}>
                                        <label htmlFor="password" className="col-md-4 control-label">Password</label>
                                        <div className="col-md-6">
                                            <input id="password" type="password" name="password" required="required" className="form-control" onChange={this.handleChange} />
                                            {field === 'password' ? <span className="help-block"><strong>{message}</strong></span> : ''}
                                        </div>
                                    </div>
                                    <div className={"form-group" + (field === 'repassword' ? " has-error" : "")}>
                                        <label htmlFor="repassword" className="col-md-4 control-label">Confirm Password</label>
                                        <div className="col-md-6">
                                            <input id="repassword" type="password" name="repassword" required="required" className="form-control" onChange={this.handleChange} />
                                            {field === 'repassword' ? <span className="help-block"><strong>{message}</strong></span> : ''}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-md-6 col-md-offset-4">
                                            <button type="submit" className="btn btn-primary" disabled={submited}>Register</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(() => ({}))(Register)
