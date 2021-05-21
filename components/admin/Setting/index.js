import React, { Component } from 'react'
import { connect } from 'react-redux';
import defaultAxios, { uploadAxios } from '../../../utils/axios';

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        this.handleCheckIcon();
        this.handleCheckLogo();
    }
    handleCheckLogo = () => {
        defaultAxios.get("/images/logo.png").then(data => this.setState({ uploaded: true })).catch(e => e)
    }
    handleCheckIcon = () => {
        defaultAxios.get("/images/favicon.ico").then(data => this.setState({ iconUploaded: true })).catch(e => e)
    }
    handleUploadLogo = e => {
        if (e.target.files?.length) {
            const formData = new FormData();
            formData.append('file', e.target.files[0], 'logo.png')
            this.setState({ loading: true })
            uploadAxios.post('/images/uploadLogo', formData)
                .then(res => {
                    if (res.data?.success) {
                        this.setState({ loading: false, uploaded: true, success: true });
                        this.timeout = setTimeout(() => {
                            this.setState({ success: false })
                        }, 3000);
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, uploaded: false })
                })
        }
    }
    handleUploadIcon = e => {
        if (e.target.files?.length) {
            const formData = new FormData();
            formData.append('file', e.target.files[0], 'favicon.ico')
            this.setState({ loadingIcon: true })
            uploadAxios.post('/images/uploadLogo', formData)
                .then(res => {
                    if (res.data?.success) {
                        this.setState({ loadingIcon: false, iconUploaded: true, successIcon: true });
                        this.timeout = setTimeout(() => {
                            this.setState({ successIcon: false })
                        }, 3000);
                    }
                })
                .catch(err => {
                    this.setState({ loadingIcon: false, iconUploaded: false })
                })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value })
    handleSubmit = e => {
        e.preventDefault();
        alert('Tính năng này đang trong quá trình thử nghiệm')
    }
    render() {
        const { uploaded, iconUploaded, successIcon, success } = this.state
        return (
            <div className="row flex-lg-nowrap">
                <div className="col mb-3">
                    <div className="e-panel card">
                        <div className="card-body">
                            <div style={{ padding: '10px 10px 15px', marginBottom: 20, borderBottom: '.5px solid #666' }}>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h5>
                                                {'Logo: '}
                                                <span style={{ fontSize: '.8em', color: 'red' }}>{uploaded ? '' : 'Bạn chưa upload logo!'}</span>
                                                <span style={{ fontSize: '.8em', color: 'green' }}>{success ? 'Upload thành công!' : ''}</span>
                                            </h5>
                                        </div>
                                        <div className="" style={{ padding: 5, position: 'relative', width: '100%', height: 200 }}>
                                            <div className="w-100 h-100 image-upload-change">
                                                <div
                                                    className="w-100 h-100 d-flex justify-content-center align-items-center image-upload-over"
                                                    style={{ backgroundImage: uploaded ? `url(${"/api/images/logo.png"})` : '#FFF' }} >
                                                </div>
                                                <div className="w-100 h-100 d-flex justify-content-center align-items-center input-upload-over">
                                                    <input type="file" name="files" id="files-logo" className="file-hidden" onChange={this.handleUploadLogo} accept="image/png" />
                                                    <label htmlFor="files-logo">
                                                        <div className="btn btn-primary">{uploaded ? 'Thay đổi (.png)' : 'Thêm mới (.png)'}</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h5>
                                                {'Favicon: '}
                                                <span style={{ fontSize: '.8em', color: 'red' }}>{iconUploaded ? '' : 'Bạn chưa upload favicon!'}</span>
                                                <span style={{ fontSize: '.8em', color: 'green' }}>{successIcon ? 'Upload thành công!' : ''}</span>
                                            </h5>
                                        </div>
                                        <div className="" style={{ padding: 5, position: 'relative', width: 200, height: 200 }}>
                                            <div className="w-100 h-100 image-upload-change">
                                                <div
                                                    className="w-100 h-100 d-flex justify-content-center align-items-center image-upload-over"
                                                    style={{ backgroundImage: iconUploaded ? `url(${"/api/images/favicon.ico"})` : '#FFF' }} >
                                                </div>
                                                <div className="w-100 h-100 d-flex justify-content-center align-items-center input-upload-over">
                                                    <input type="file" name="files" id="files-icon" className="file-hidden" onChange={this.handleUploadIcon} accept="image/x-icon" />
                                                    <label htmlFor="files-icon">
                                                        <div className="btn btn-primary">{iconUploaded ? 'Thay đổi (.ico)' : 'Thêm mới (.ico)'}</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <form onSubmit={this.handleSubmit} style={{ padding: '0px 10px' }}>
                                        <div className="form-group" style={{ marginBottom: 20 }}>
                                            <h5 style={{ borderBottom: '1px solid #aaa', width: 'max-content', paddingBottom: 5 }}><b>Nhúng code</b></h5>
                                        </div>
                                        <div className="row" style={{ borderBottom: '.5px solid #ccc', paddingBottom: 15, marginBottom: 15 }}>
                                            <div className="col col-3">
                                                <h6>HEADER SCRIPTS:</h6>
                                            </div>
                                            <div className="col col-9">
                                                <div className="form-group">
                                                    <textarea rows={4} className="form-control" name="headerScript" onChange={this.handleChange} />
                                                </div>
                                                <div style={{ fontSize: '.8em' }}>Thêm các tập lệnh tùy chỉnh bên trong thẻ HEAD. Bạn cần có thẻ SCRIPT xung quanh các tập lệnh.</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ borderBottom: '.5px solid #ccc', paddingBottom: 15, marginBottom: 15 }}>
                                            <div className="col col-3">
                                                <h6>BODY SCRIPTS:</h6>
                                            </div>
                                            <div className="col col-9">
                                                <div className="form-group">
                                                    <textarea rows={4} className="form-control" name="bodyScript" onChange={this.handleChange} />
                                                </div>
                                                <div style={{ fontSize: '.8em' }}>Thêm các tập lệnh tùy chỉnh mà bạn có thể muốn tải ở phần chân trang của trang web. Bạn cần có thẻ SCRIPT xung quanh các tập lệnh.</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ borderBottom: '.5px solid #ccc', paddingBottom: 15, marginBottom: 15 }}>
                                            <div className="col col-3">
                                                <h6>FOOTER SCRIPTS:</h6>
                                            </div>
                                            <div className="col col-9">
                                                <div className="form-group">
                                                    <textarea rows={4} className="form-control" name="footerScript" onChange={this.handleChange} />
                                                </div>
                                                <div style={{ fontSize: '.8em' }}>Thêm các tập lệnh tùy chỉnh ngay sau khi thẻ BODY được mở. Bạn cần có thẻ SCRIPT xung quanh các tập lệnh.</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col d-flex justify-content-end">
                                                <div className="form-group">
                                                    <button className="btn btn-primary" type="submit">Lưu lại</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(() => ({}))(Setting);