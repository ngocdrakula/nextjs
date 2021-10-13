import React, { Component } from 'react';
import { connect } from 'react-redux'
import langConfig from '../lang.config';
import { translate } from '../utils/language';
import ContactForm from './ContactForm';

class Footer extends Component {
    scrollTop = () => {
        document.documentElement.scrollTop = 0;
    }
    render() {
        const { setting: { facebook, zalo, spyke, youtube, } } = this.props;
        return (
            <>
                <footer id="footer" className="site-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="contact">
                                    <h3>{translate(langConfig.app.Contact)}</h3>
                                    <p><strong>TRUNG TÂM HỖ TRỢ PHÁT TRIỂN CÔNG NGHIỆP - CỤC CÔNG NGHIỆP</strong></p>
                                    <p><img src="images/address.png" alt="" />655 Phạm Văn Đồng, P. Cổ Nhuế 1, Q. Bắc Từ Liêm, Hà Nội</p>
                                    <p>
                                        <span><img src="images/phone.png" alt="" />+84-24-3758 6810</span>
                                        <span><img src="images/email.png" alt="" />vimexpo.via@gmail.com</span>
                                    </p>
                                    <p>
                                        <span><img src="images/user.png" alt="" />Ms. Nguyễn Trà My</span>
                                        <span><img src="images/phone2.png" alt="" />+84-967 179 807</span>
                                    </p>
                                    <p><strong>CÔNG TY CỔ PHẦN QUẢNG CÁO &amp; HỘI CHỢ TRIỂN LÃM C.I.S VIỆT NAM</strong></p>
                                    <p><img src="images/address.png" alt="" />Số 112 - A3 Đầm Trấu, P. Bạch Đằng, Q. Hai Bà Trưng, Hà Nội </p>
                                    <p>
                                        <span><img src="images/phone.png" alt="" />+84-24-3984 4104/05</span>
                                        <span><img src="images/fax.png" alt="" />+84-24-3984 4108</span>
                                    </p>
                                    <p><img src="images/web.png" alt="" />www.cisvietnam.com.vn / www.cisdesign.vn</p>
                                    <p>
                                        <span><img src="images/user.png" alt="" />Ms. Quỳnh Hương</span>
                                        <span><img src="images/email.png" alt="" />huongnq@cisvietnam.com.vn</span>
                                        <span style={{ marginLeft: 20 }}><img src="images/phone2.png" alt="" />+84-913 056 968</span>
                                    </p>
                                    <p style={{ marginLeft: 15 }}>Chi nhánh Công ty CIS Vietnam tại TP. Hồ Chí Minh</p>
                                    <p><img src="images/address.png" alt="" />Số 10.02 lô A, tòa nhà SATRA, 163 Phan Đăng Lưu, Q. Phú Nhuận, TP.HCM</p>
                                    <p>
                                        <span><img src="images/phone.png" alt="" />+84-28 39958116 </span>
                                        <span><img src="images/fax.png" alt="" />+84-28 39958118</span>
                                    </p>
                                </div>
                                <div className="social">
                                    <a href={facebook || "#"} target="_blank"><img src="images/fb.png" alt="Facebook" title="Facebook" /></a>
                                    <a href={zalo || "#"} target="_blank"><img src="images/zalo.png" alt="Zalo" title="Zalo" /></a>
                                    <a href={spyke || "#"} target="_blank"><img src="images/skype.png" alt="Spyke" title="Spyke" /></a>
                                    <a href={youtube || "#"} target="_blank"><img src="images/youtube.png" alt="Spyke" title="Spyke" /></a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="copyright">
                    Copyright 2020. CISDESIGN. All rights reserved
                    <div className="scroll-top" onClick={this.scrollTop}>
                        <img src="images/icon-top.png" alt="" />
                    </div>
                </div>
            </>
        )
    }
}




export default connect(({ app: { setting } }) => ({ setting }))(Footer)
