import React, { Component } from 'react'
import { connect } from 'react-redux';

class Feature extends Component {
    render() {
        return (

            <div id="features">
                <div className="container">
                    <h2 className="heading">Nâng tầm triển lãm ảo với các tính năng tuyệt vời</h2>
                    <div className="heading-bottom"><img src="/images/heading-bottom.png" alt =""/></div>
                    <div className="features-list">
                        <div className="row">
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-item">
                                    <img src="/images/account.png" alt =""/>
                                    <div>
                                        <h3>Tài khoản riêng</h3>
                                        <p>Mỗi đơn vị khi tham dự triển lãm sẽ được cung cấp 1 tài khoản riêng để tiếp cận đối tác với thông tin rõ ràng.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-item">
                                    <img src="/images/finding.png" alt =""/>
                                    <div>
                                        <h3>Tìm kiếm nội dung</h3>
                                        <p>Hệ thống tìm kiếm theo tên công ty cực kỳ nhanh chóng và thuận tiện.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-item">
                                    <img src="/images/chat.png" alt =""/>
                                    <h3>Chát trực tuyến</h3>
                                    <p>Tính năng trò chuyện trực tuyến và email tự động giúp kết nối các đối tượng tham gia hiệu quả.</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-item">
                                    <img src="/images/live.png" alt =""/>
                                    <div>
                                        <h3>Phát sóng trực tuyến</h3>
                                        <p>Tính năng phát sóng trực tiếp, giúp tiếp cận nhiều hơn, hiệu quả hơn với khách hàng tiềm năng.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-item">
                                    <img src="/images/shop-online.png" alt =""/>
                                    <div>
                                        <h3>Gian hàng online</h3>
                                        <p>Hệ thống gian hàng 2D mang tới đầy đủ thông tin cùng trải nghiệm hoàn toàn mới.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-item">
                                    <img src="/images/system-admin.png" alt =""/>
                                    <div>
                                        <h3>Hệ thông quản trị</h3>
                                        <p>Cho phép tùy chỉnh dễ dàng thông tin cũng như hình ảnh của nhà trưng bày khi tham gia.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Feature)
