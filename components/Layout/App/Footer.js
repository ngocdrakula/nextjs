import React, { Component } from 'react';
import { connect } from 'react-redux'
import langConfig from '../../../lang.config';
import { getLocale, translate } from '../../../utils/language';
import ContactForm from './ContactForm';

class Footer extends Component {
    scrollTop = () => {
        document.documentElement.scrollTop = 0;
    }
    render() {
        const setting = this.props.setting[getLocale()] || {};
        const { facebook, zalo, spyke, youtube, footer } = setting;
        let footerHTML = null;
        try { footerHTML = <div dangerouslySetInnerHTML={{ __html: footer }} /> }
        catch (e) { };
        return (
            <>
                <footer id="footer" className="site-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="contact">
                                    <h3>{translate(langConfig.app.Contact)}</h3>
                                    <p><strong>{translate(langConfig.app.INDUSTRIALDEVELOPMENTSUPPORTCENTERINDUSTRYDEVELOPMENT)}</strong></p>
                                    <p><img src="images/address.png" alt="" />{translate(langConfig.app.S_655_Pham_Van_Dong_street_Co_Nhue_1_ward_Bac_Tu_Liem_district_Hanoicity)}</p>
                                    <p>
                                        <span><img src="images/phone.png" alt="" />+84-024.3758.6810</span>
                                        <span><img src="images/email.png" alt="" />vimexpo.via@gmail.com</span>
                                    </p>
                                    <p>
                                        <span><img src="images/user.png" alt="" />Ms. Nguyễn Trà My</span>
                                        <span><img src="images/phone2.png" alt="" />+84-967 179 807</span>
                                    </p>
                                    <p><strong>{translate(langConfig.app.C_I_S_VIETNAM_ADVERTISING___EXHIBITION_JOINT_STOCK_COMPANY)}</strong></p>
                                    <p><img src="images/address.png" alt="" />{translate(langConfig.app.Head_Office_112__A3_Dam_Trau_Bach_Dang_Ward_Hai_Ba_Trung_District_Hanoi)}</p>
                                    <p>
                                        <span><img src="images/phone.png" alt="" />+84-24-3984 4104/05</span>
                                        <span><img src="images/fax.png" alt="" />+84-24-3984 4108</span>
                                    </p>
                                    <p><img src="images/web.png" alt="" />www.cisvietnam.com.vn / www.cisdesign.vn</p>
                                    <p>
                                        <span><img src="images/user.png" alt="" />Ms. Quỳnh Hương</span>
                                        <span><img src="images/email.png" alt="" />huongnq@cisvietnam.com.vn</span>
                                        <span style={{ marginLeft: 20 }}><img src="images/phone2.png" alt="" />+84-913056968</span>
                                    </p>
                                    <p><img src="images/address.png" alt="" />{translate(langConfig.app.Ho_Chi_Minh_Branch_10_02_Lot_A_SATRA_Building_163_Phan_Dang_Luu_Phu_Nhuan_Dist_HCMC)}</p>
                                    <p>
                                        <span><img src="images/phone.png" alt="" /> +84-28 39958116 </span>
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
                <script type="text/javascript" dangerouslySetInnerHTML={{
                    __html: `
                    function googleTranslateElementInit() {
                        new google.translate.TranslateElement({
                            pageLanguage: 'vi',
                        }, '__next');
                    }
                    `}}
                />
                <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
                {footerHTML}
            </>
        )
    }
}




export default connect(({ app: { setting } }) => ({ setting }))(Footer)
