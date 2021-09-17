import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

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
                        <li className={active === 4 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(4)}>
                                <i className="fa fa-calendar" /> <span>Lịch giao thương</span>
                            </a>
                        </li>
                        <li className={active === 1 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(1)}>
                                <i className="fa fa-map-marker" /> <span> Danh sách chuyên mục</span>
                            </a>
                        </li>
                        <li className={active === 2 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(2)}>
                                <i className="fa fa-user-secret" /> <span>Danh sách sản phẩm</span>
                            </a>
                        </li>
                        <li className={active === 5 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(5)}>
                                <i className="fa fa-user-secret" /> <span>Danh sách livestream</span>
                            </a>
                        </li>
                        <li className={active === 3 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(3)}>
                                <i className="fa fa-wechat" /> <span>Chat{newMessage ? ` (${newMessage})` : ""}</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}

export default connect(({ admin: { newMessage } }) => ({ newMessage }))(SideBar)
