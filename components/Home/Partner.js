import React, { Component } from 'react'
import { connect } from 'react-redux';

class Partner extends Component {
    render() {
        return (
            <div id="partner">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="partner-info">
                                <p><span>Cơ quan chỉ đạo</span><span>: BỘ CÔNG THƯƠNG</span></p>
                                <p><span>Đơn vị trủ chì</span><span>: Cục Công nghiệp (Bộ Công Thương)</span><br />
                                    <span style={{ float: 'right' }} className="mobile-left">Trung tâm Hỗ trợ phát triển công nghiệp (IDC)</span></p>
                                <p><span>Đơn vị tổ chức</span><span>: Công ty QC &amp; HC Triển lãm C.I.S Vietnam</span></p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="partner-logo">
                                <img src="/images/partner1.png" alt="" />
                                <img src="/images/partner2.png" alt="" />
                                <img src="/images/partner3.png" alt="" />
                                <img src="/images/partner4.png" alt="" />
                            </div>
                        </div>
                        <div className="col-md-6 mt-56">
                            <p>Đơn vị phối hợp:</p>
                            <img src="/images/support1.png" alt="" style={{ display: 'block', margin: '0 auto 15px' }} />
                            <img src="/images/support2.png" alt="" />
                        </div>
                        <div className="col-md-6 mt-56">
                            <p>Bảo trợ thông tin:</p>
                            <img src="/images/support3.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Partner)
