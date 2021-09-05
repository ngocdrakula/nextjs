import React, { Component } from 'react'
import { connect } from 'react-redux';

class Partner extends Component {
    render() {
        return (
            <div id="partner">
                <div className="container">
                    <div className="row partner-info">
                        <div className="col-md-6">
                            <div className="row" style={{ marginBottom: 10 }}>
                                <div className="col-sm-4">
                                    <p>Cơ quan chỉ đạo:</p>
                                </div>
                                <div className="col-sm-8">
                                    <p>BỘ CÔNG THƯƠNG</p>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: 10 }}>
                                <div className="col-sm-4">
                                    <p>Đơn vị trủ chì:</p>
                                </div>
                                <div className="col-sm-8">
                                    <p>Cục Công nghiệp (Bộ Công Thương)</p>
                                    <p>Trung tâm Hỗ trợ phát triển công nghiệp (IDC)</p>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: 10 }}>
                                <div className="col-sm-4">
                                    <p>Đơn vị tổ chức:</p>
                                </div>
                                <div className="col-sm-8">
                                    <p>Công ty QC &amp; HC Triển lãm C.I.S Vietnam</p>
                                </div>
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
