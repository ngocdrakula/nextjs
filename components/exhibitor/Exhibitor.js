import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import SideBar from './SideBar';
import Product from './Product';
import Overview from './Overview';
import Category from './Category';
import Chat from '../Chat';
import Trade from '../Trade';
import Livestream from './Livestream';


class Exhibitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        }
    }

    handleToggle = () => this.setState({ toggle: !this.state.toggle })
    handleActive = (index) => this.setState({ active: index })

    render() {
        const { toggle, active } = this.state;
        return (
            <div className={"wrapper " + (toggle ? "skin-purple sidebar-mini sidebar-collapse" : "skin-purple sidebar-mini")}>
                <Header
                    handleToggle={this.handleToggle}
                    handleActiveMessage={() => this.handleActive(3)}
                    handleActiveUser={() => this.handleActive(0)}
                    toggle={toggle}
                />
                <SideBar handleActive={this.handleActive} active={active} />
                <div className="content-wrapper">
                    <Overview active={active === 0} />
                    <Category active={active === 1} />
                    <Product active={active === 2} />
                    <Chat active={active === 3} />
                    <Trade active={active === 4} />
                    <Livestream active={active === 5} />
                </div>
            </div >
        )
    }
}

export default connect(({ }) => ({}))(Exhibitor);