import React, { Component } from 'react'
import { connect } from 'react-redux';

class Slider extends Component {
    render() {
        return (
            <div id="slider">
                <div className="container">
                    <div className="slide-thumb">
                        <img src="/images/slide-thumb.png" alt =""/>
                    </div>
                    <div className="slide-text">
                        <h1>Triển lãm trực tuyến <span>VIMEXPO 2021</span></h1>
                        <div className="time-location">
                            <p className="time">27 <img src="/images/icon-right.png" alt =""/> 29.01.2021</p>
                            <p className="location">Trung tâm Triển lãm Quốc tế I.C.E Hanoi <br />Cung VHHN, số 91 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội</p>
                        </div>
                        <p className="txt-white">Kết nối để phát triển</p>
                        <p className="txt-last">Triển lãm trực tuyến VIMEXPO 2021 là kênh Triển lãm <br />online để tăng kết nối, xúc tiến thương mại và phục vụ các <br />nhà trưng bày trong và ngoài nước</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Slider)
