import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../redux/types';

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.initState = { email: '', name: '', title: '', message: '' }
        this.state = {
            ...this.initState
        };
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleSubmit = e => {
        e.preventDefault();
        const { email, name, title, message } = this.state;
        if (email && name && title && message) {
            const { dispatch } = this.props;
            dispatch({
                type: types.SEND_CONTACT,
                payload: { email, name, title, message },
                callback: res => {
                    if (res?.success) {
                        this.setState({ ...this.initState, success: true })
                    }
                }
            })
        }
    }
    render() {
        const { email, name, title, message, success } = this.state;
        return (
            <div className="form contact-form">
                <div className="form-group">
                    <input type="text" className="form-control" name="name" placeholder="Họ và tên" value={name} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder="Email" value={email} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="title" placeholder="Chủ đề" value={title} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <textarea className="form-control" name="message" placeholder="Tin nhắn" rows={5} value={message} onChange={this.handleChange} />
                </div>
                {success ?
                    <p>Gửi tin nhắn thành công!</p>
                    : ""}
                <button type="submit" className={"contact-submit" + (email && name && title && message ? "" : " disabled-btn")} onClick={this.handleSubmit}>Gửi</button>
            </div>
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(ContactForm)
