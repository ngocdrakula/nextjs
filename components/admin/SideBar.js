import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import { translate } from '../../utils/language';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { active, handleActive, newMessage, newNoti } = this.props;
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        <li className={active === 0 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(0)}>
                                <i className="fa fa-dashboard" /> <span>{translate(langConfig.app.Overview)}</span>
                            </a>
                        </li>
                        <li className={active === 1 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(1)}>
                                <i className="fa fa-map-marker" /> <span> {translate(langConfig.app.ExhibitorList)}</span>
                            </a>
                        </li>
                        <li className={(active === 2 ? "active" : "") + (newNoti ? " new" : "")}>
                            <a href="#" onClick={() => handleActive(2)}>
                                <i className="fa fa-user-secret" /> <span>{translate(langConfig.app.VisitorList)}</span>
                            </a>
                        </li>
                        <li className={active === 7 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(7)}>
                                <i className="fa fa-calendar" /> <span>{translate(langConfig.app.TradeCalendar)}</span>
                            </a>
                        </li>
                        <li className={active === 3 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(3)}>
                                <i className="fa fa-tags" /> <span>{translate(langConfig.app.IndustryList)}</span>
                            </a>
                        </li>
                        <li className={active === 4 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(4)}>
                                <i className="fa fa-meetup" /> <span>{translate(langConfig.app.Contact)}</span>
                            </a>
                        </li>
                        <li className={(active === 5 ? "active" : "") + (newMessage ? " new" : "")}>
                            <a href="#" onClick={() => handleActive(5)}>
                                <i className="fa fa-wechat" /> <span>{translate(langConfig.app.Chat)}{newMessage ? ` (${newMessage})` : ""}</span>
                            </a>
                        </li>
                        <li className={active === 8 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(8)}>
                                <i className="fa fa-support" /> <span>{translate(langConfig.app.AdminInformation)}</span>
                            </a>
                        </li>
                        <li className={active === 6 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(6)}>
                                <i className="fa fa-support" /> <span>{translate(langConfig.app.PageSetting)}</span>
                            </a>
                        </li>
                        <li className={active === 9 ? "active" : ""}>
                            <a href="#" onClick={() => handleActive(9)}>
                                <i className="fa fa-support" /> <span>{translate(langConfig.app.ChangePassword)}</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}

export default connect(({ admin: { newMessage, newNoti } }) => ({ newMessage, newNoti }))(SideBar)
