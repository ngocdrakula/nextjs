import React, { Component } from 'react'
import { connect } from 'react-redux';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { active, handleActive, newMessage } = this.props;
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        <li className={active === 0 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(0)}>
                                <i className="fa fa-dashboard" /> <span>Tổng quan</span>
                            </a>
                        </li>
                        <li className={active === 1 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(1)}>
                                <i className="fa fa-map-marker" /> <span> Danh sách nhà trưng bày</span>
                            </a>
                        </li>
                        <li className={active === 2 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(2)}>
                                <i className="fa fa-user-secret" /> <span>Danh sách khách tham quan</span>
                            </a>
                        </li>
                        <li className={active === 7 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(7)}>
                                <i className="fa fa-calendar" /> <span>Lịch giao thương</span>
                            </a>
                        </li>
                        <li className={active === 3 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(3)}>
                                <i className="fa fa-tags" /> <span>Danh sách ngành nghề</span>
                            </a>
                        </li>
                        <li className={active === 4 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(4)}>
                                <i className="fa fa-meetup" /> <span>Liên hệ</span>
                            </a>
                        </li>
                        <li className={active === 5 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(5)}>
                                <i className="fa fa-wechat" /> <span>Chat{newMessage ? ` (${newMessage})` : ""}</span>
                            </a>
                        </li>
                        <li className={active === 6 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(6)}>
                                <i className="fa fa-support" /> <span>Cài đặt trang web</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}

export default connect(({ admin: { newMessage } }) => ({ newMessage }))(SideBar)
