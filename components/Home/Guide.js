import React, { Component } from 'react'
import { connect } from 'react-redux';

class Guide extends Component {
    render() {
        return (
            <div id="guide">
                <div className="main-title hd-bg-blue">
                    <h2 className="heading">Hướng dẫn tham gia triển lãm trực tuyến</h2>
                    <div className="heading-bottom"><img src="/images/heading-bottom-guide.png" alt="" /></div>
                    <div className="container">
                        <div className="row guide-steps">
                            <div className="col-sm-4">
                                <div className="step-item">
                                    <img src="/images/step1.png" alt="" />
                                    <p><span>Bước 1</span>Đăng ký Tài khoản dành cho Khách tham quan</p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="step-item">
                                    <img src="/images/step2.png" alt="" />
                                    <p><span>Bước 2</span>Nhận email Đăng ký thành công từ Ban tổ chức</p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="step-item">
                                    <img src="/images/step3.png" alt="" />
                                    <p><span>Bước 3</span>Tham quan Gian hàng. <br />Kết nối với Nhà trưng bày</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Guide)
