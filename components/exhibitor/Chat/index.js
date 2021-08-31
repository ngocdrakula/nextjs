import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            address: '',
            phone: '',
            hotline: '',
            fax: '',
            representative: '',
            position: '',
            mobile: '',
            re_email: '',
            website: '',
            introduce: '',
            contact: '',
            enabled: true,
            fieldError: null,
            message: ''
        }
    }
    componentDidMount() {
        if (this.props.exUser) this.handleCancel();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.exUser && this.props.exUser?._id) {
            this.handleCancel();
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { industries, dispatch } = this.props;
        const { _id, email, name, address, phone, hotline, fax, representative, position,
            mobile, re_email, website, introduce, contact, selected, filesAvatar, files } = this.state;
        const industry = selected || industries[0]?._id;
        const dataRequied = { email, name, address, phone, representative, position, mobile, re_email, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: 'Vui lòng điền đầy đủ thông tin' })
        }
        else {
            const data = {
                _id, email, name, address, phone, hotline, fax, representative,
                position, mobile, re_email, website, introduce, contact, industry,
            }
            const filesTotal = [];
            if (filesAvatar?.length) {
                data.avatar = true;
                filesTotal.push(filesAvatar[0])
            }
            if (files?.length) {
                data.image = true;
                filesTotal.push(files[0])
            }
            if (filesTotal.length) data.files = filesTotal;
            const formData = createFormData(data);

            dispatch({
                type: types.ADMIN_UPDATE_USER,
                payload: { _id, formData },
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: 'Cập nhật thành công',
                                message: 'Cập nhật thông tin thành công?',
                                confirm: 'Chấp nhận',
                                cancel: 'Đóng',
                                handleConfirm: this.handleCancel,
                                handleCancel: this.handleCancel
                            },
                        });
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            message: res.data.message || "Vui lòng điền đầy đủ thông tin"
                        })
                    }
                }
            });
        }
    }

    handleDropdownIndustry = () => this.setState({ dropIndustry: !this.state.dropIndustry })

    handleCancel = () => this.setState({
        ...this.props.exUser,
        selected: this.props.exUser.industry[0]?._id,
        files: null,
        filesAvatar: null,
        fieldError: null,
        message: '',
        onEdit: false
    })

    handleChooseFilesAvatar = e => {
        this.setState({ filesAvatar: e.target.files })
    }
    handleChooseFiles = e => {
        this.setState({ files: e.target.files })
    }
    render() {
        const { active, exUser, industries } = this.props;
        const { email, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, avatar, image,
            selected, dropIndustry, fieldError, message, onEdit, files, filesAvatar } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        if (!active) return null;
        return (
            <section className="content">
                <div className="callout callout-info">
                    <p>
                        <strong><i className="icon ion-md-nuclear" /> Alert!</strong>
                        You are impersonated into the current account. Be careful about your actions.
                        <a href="https://online.vietnam-autoexpo.com/admin/secretLogout" className="nav-link pull-right"><i className="fa fa-sign-out" data-toggle="tooltip" data-placement="top" title="Log out" /></a>
                    </p>
                </div>
                <div id="chatbox">
                    <div className="row chatContent">
                        <div className="col-sm-4 side">
                            <div id="leftsidebar">
                                <div className="row heading">
                                    <div className="heading-title">
                                        <i className="fa fa-comments fa-2x" aria-hidden="true" />
                                        Cuộc hội thoại
                                    </div>
                                </div>
                                <div className="row sidebarContent">
                                    <div id="chat-1" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/2" className="get-content" style={{}}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://online.vietnam-autoexpo.com/image/images/1621565557-15.png?p=mini" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta ">
                                                            Huy Mạnh
                                                            <span className="label label-primary flat indent10 hide">Read</span>
                                                        </span>
                                                        <p className="excerpt ">
                                                            <span className="small text-muted">You: </span>FHJ
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-3" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/3" className="get-content" style={{}}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://online.vietnam-autoexpo.com/image/images/1621565495-000065.JPG?p=mini" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta ">
                                                            Nhung Thiều
                                                            <span className="label label-primary flat indent10 hide">Read</span>
                                                        </span>
                                                        <p className="excerpt ">
                                                            jytu
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-5" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/6" className="get-content" style={{}}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://www.gravatar.com/avatar/902799e76f7a47ed240a62521a526457?s=60&d=mm" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta ">
                                                            Bùi Tuấn Anh
                                                            <span className="label label-primary flat indent10 hide">Read</span>
                                                        </span>
                                                        <p className="excerpt ">
                                                            âldkld
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-143" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/14" className="get-content" style={{}}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://www.gravatar.com/avatar/710325b86c0365ba53e138850517be84?s=60&d=mm" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta ">
                                                            Huy Cường Nguyễn
                                                            <span className="label label-primary flat indent10 hide">Read</span>
                                                        </span>
                                                        <p className="excerpt ">
                                                            <span className="small text-muted">You: </span>chao quy khach
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-145" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/16" className="get-content" style={{ color: '#222' }}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://www.gravatar.com/avatar/a49647747ee28b310a7739a562ec1bee?s=60&d=mm" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta">
                                                            Ken Nguyen
                                                            <span className="label label-primary flat indent10 hide">Unread</span>
                                                        </span>
                                                        <p className="excerpt">
                                                            aloalo
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">3 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-146" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/19" className="get-content" style={{ color: '#222' }}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://www.gravatar.com/avatar/3784a65f203a96d44fac3fbb3f3cb68b?s=60&d=mm" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta">
                                                            Dương Lê Minh
                                                            <span className="label label-primary flat indent10 hide">Unread</span>
                                                        </span>
                                                        <p className="excerpt">
                                                            hi there
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-71" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/21" className="get-content" style={{ color: '#222' }}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://www.gravatar.com/avatar/f0ae9c3d8ed8f1d2082bbb37f0b8fe8e?s=60&d=mm" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta">
                                                            Nga
                                                            <span className="label label-primary flat indent10 hide">New</span>
                                                        </span>
                                                        <p className="excerpt">
                                                            abbdh
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-153" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/23" className="get-content" style={{ color: '#222' }}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://online.vietnam-autoexpo.com/image/images/1624005309-6a35243b1e80f9dea091.jpg?p=mini" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta">
                                                            Thảo
                                                            <span className="label label-primary flat indent10 hide">Unread</span>
                                                        </span>
                                                        <p className="excerpt">
                                                            toi can tu van
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 months ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="chat-148" className="row sidebarBody ">
                                        <a href="javascript:void(0)" data-link="https://online.vietnam-autoexpo.com/admin/support/chat/27" className="get-content" style={{ color: '#222' }}>
                                            <div className="col-sm-3 col-xs-3">
                                                <img src="https://www.gravatar.com/avatar/1de3512e0e73e5dac972f3155cbb7c40?s=60&d=mm" className="img-circle" alt="Avatar" />
                                            </div>
                                            <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                                                <div className="row">
                                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                                                        <span className="name-meta strong">
                                                            Tra Hoang
                                                            <span className="label label-primary flat indent10 ">Unread</span>
                                                        </span>
                                                        <p className="excerpt strong">
                                                            hi
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-4 col-xs-4 pull-right time">
                                                        <span className="time-meta pull-right">2 weeks ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="chatConversation" className="col-sm-8 conversation"><div id="openChatbox-146" className="row heading">
                            <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
                                <img src="https://www.gravatar.com/avatar/3784a65f203a96d44fac3fbb3f3cb68b?s=60&d=mm" className="img-circle" alt="Avatar" />
                            </div>
                            <div className="col-sm-8 col-xs-7 heading-name">
                                <span className="heading-name-meta">Dương Lê Minh</span>
                            </div>
                            <div className="col-sm-1 col-xs-1  heading-dot pull-right">
                            </div>
                        </div>
                            <div className="row message" id="conversationBox">
                                <div className="row message-previous">
                                    <div className="col-sm-12 previous">
                                        <a onclick="previous(this)" id="ankitjain28" name={20}>
                                        </a>
                                    </div>
                                </div>
                                <div className="row message-body">
                                    <div className="col-sm-12 message-main-receiver">
                                        <div className="receiver">
                                            <div className="message-text">
                                                hi
                                            </div>
                                        </div>
                                        <span className="message-time">
                                            2 months ago
                                        </span>
                                    </div>
                                </div>
                                <div className="row message-body">
                                    <div className="col-sm-12 message-main-receiver">
                                        <div className="receiver">
                                            <div className="message-text">
                                                hi there
                                            </div>
                                        </div>
                                        <span className="message-time">
                                            2 months ago
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="row reply">
                                <form method="POST" action="https://online.vietnam-autoexpo.com/admin/support/chat/19/reply" acceptCharset="UTF-8" id="chat-form" data-toggle="validator" encType="multipart/form-data"><input name="_token" type="hidden" defaultValue="uPKYk9wxOtL4VxbAcism4Ls0KnhYof7GOK4tSP4e" />
                                    <div className="col-sm-1 col-xs-1 reply-attachment">
                                    </div>
                                    <div className="col-sm-10 col-xs-10 reply-main">
                                        <textarea id="message" name="message" placeholder="Nhập tin nhắn mới ... " className="form-control" rows={1} defaultValue={""} />
                                    </div>
                                    <div className="col-sm-1 col-xs-1 reply-send nopadding-left">
                                        <i className="fa fa-send fa-2x" id="send-btn" aria-hidden="true" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        )
    }
}

export default connect(({ admin: { exUser, industries } }) => ({ exUser, industries }))(Overview)
