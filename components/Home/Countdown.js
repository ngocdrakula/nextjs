import React, { Component } from 'react'
import { connect } from 'react-redux';

class Countdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            d: 0,
            h: 0,
            m: 0,
            s: 0
        }
    }
    componentDidMount() {
        const deadline = (new Date('08/27/2021')).getTime();
        if (deadline > Date.now()) {
            this.interval = setInterval(() => {
                const current = Date.now();
                const diff = Math.floor((deadline - current) / 1000);
                const d = Math.floor(diff / (24 * 60 * 60));
                const h = Math.floor(diff / (60 * 60)) % 24
                const m = Math.floor(diff / 60) % 60
                const s = Math.floor(diff) % 60;
                this.setState({ d, h, m, s })
            }, 1000);
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const { d, h, m, s } = this.state;
        return (
            <div id="counter">
                <div className="container">
                    <div className="counter-time">
                        <div className="counter-time-item">
                            <span className="days" id="days">{d < 10 ? "0" + d : d}</span>
                            <span className="couter-txt">Ngày</span>
                        </div>
                        <div className="counter-time-item">
                            <span className="hours" id="hours">{h < 10 ? "0" + h : h}</span>
                            <span className="couter-txt">Giờ</span>
                        </div>
                        <div className="counter-time-item">
                            <span className="minutes" id="minutes">{m < 10 ? "0" + m : m}</span>
                            <span className="couter-txt">Phút</span>
                        </div>
                        <div className="counter-time-item">
                            <span className="seconds" id="seconds">{s < 10 ? "0" + s : s}</span>
                            <span className="couter-txt">Giây</span>
                        </div>
                    </div>
                    <div className="register-guest">
                        <a href="#"><img src="/images/icon-register-guest.png" alt="" />Đăng ký <span>Khách tham quan</span></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Countdown)
