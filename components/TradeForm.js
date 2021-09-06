import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../redux/types';

class TradeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: '',
            deadline: '',
            success: false
        }
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onCreate && this.props.onCreate) {
            this.setState({
                link: '',
                deadline: '',
                success: false
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { link, deadline } = this.state;
        const { dispatch, onCreate } = this.props;
        if (deadline && onCreate) {
            dispatch({
                type: types.ADD_TRADE,
                payload: { link, deadline, to: onCreate._id },
                callback: res => {
                    if (!res?.success) {
                        this.setState({ message: res?.message || 'Vui lòng kiểm tra kết nối internet' })
                    }
                    else {
                        this.setState({ success: true })
                    }
                }
            })
        }
    }
    handleClose = () => {
        const { dispatch } = this.props;
        dispatch({
            type: types.CREATE_TRADE,
            payload: null
        });
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value })
    render() {
        const { onCreate, user } = this.props;
        const { link, deadline, message, success } = this.state;
        console.log(onCreate)
        return (
            <div className="container-DKGiaoThuong" style={{ display: onCreate ? 'block' : 'none' }}>
                <div className="overlay" />
                <div className="card" style={{ overflow: 'auto' }}>
                    <div className="form__name" style={{ marginBottom: 10 }}>
                        Tạo lịch giao thương
                        <div onClick={this.handleClose} style={{ float: 'right', cursor: 'pointer' }} className="btn-close-gt">X</div>
                    </div>
                    <div className="contact__container">
                        <div className="section">
                            <div className="box">1</div>
                            <span>Thông tin của bạn</span>
                        </div>
                        <form className="form__contact">
                            <div className="cname">
                                <label>Name</label> <input className="inputGT" name="nameCompany" type="text" value={user?.name || ''} disabled readOnly />
                            </div>
                            <div className="cnum">
                                <label>Email</label> <input className="inputGT" name="emailCompany" type="email" value={user?.email || ''} disabled readOnly />
                            </div>
                        </form>
                    </div>
                    <div className="contact__container">
                        <div className="section">
                            <div className="box">2</div>
                            <span>Thông tin đối tác</span>
                        </div>
                        <form className="form__contact">
                            <div className="cname">
                                <label>Name</label> <input className="inputGT" name="nameCompany" type="text" value={onCreate?.name || ''} disabled readOnly />
                            </div>
                            <div className="cnum">
                                <label>Email</label> <input className="inputGT" name="emailCompany" type="email" value={onCreate?.email || ''} disabled readOnly />
                            </div>
                        </form>
                    </div>
                    <div className="contact__container">
                        <div className="section">
                            <div className="box">3</div><span>Thời gian và liên kết</span>
                        </div>
                        <form className="form__contact" style={{ flexWrap: 'wrap' }} onSubmit={this.handleSubmit}>
                            <div className="email">
                                <label>Thời gian</label> <input className="inputGT" placeholder="Chọn thời gian giao thương" name="deadline" type="datetime-local" value={deadline} required onChange={this.handleChange} disabled={success} />
                            </div>
                            <div className="email">
                                <label>Liên kết</label> <input className="inputGT" placeholder="Nhập link giao thương" name="link" type="text" value={link} onChange={this.handleChange} disabled={success} />
                            </div>
                        </form>
                    </div>
                    {success ?
                        <div className="contact__container">
                            <div style={{ color: 'green' }}>Tạo lịch giao thương thành công</div>
                        </div>
                        : ""}
                    <div className="form__confirmation">
                        {success ?
                            <button onClick={this.handleClose} className="btnSubmit-dkgt">Đóng</button>
                            :
                            <button onClick={this.handleSubmit} className="btnSubmit-dkgt">Tạo lịch</button>
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(({ app: { onCreate, user } }) => ({ onCreate, user }))(TradeForm)
