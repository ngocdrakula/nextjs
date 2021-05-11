import React, { Component } from 'react'
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import types from '../../redux/types';


const ProductInfoPanel = dynamic(() => import('./ProductInfoPanel'));
const RoomSelect = dynamic(() => import('./RoomSelect'));
const SaveModal = dynamic(() => import('./SaveModal'));

class BottomPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            langLists: [
                { _id: 0, name: 'vn', },
                { _id: 1, name: 'en', },
            ],
            selected: 0
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.visible && !prevProps.visible && this.state.visibleProduct) {
            this.setState({ visibleProduct: false });
        }
    }
    handleToggle = () => {
        const { visibleRoom } = this.state;
        this.setState({ visibleRoom: !visibleRoom, background: !visibleRoom });
    }
    handleToggleLang = () => {
        const { visibleLang } = this.state;
        this.setState({ visibleLang: !visibleLang });
    }
    handleChooseLang = (selected) => { this.setState({ selected, visibleLang: false }) }
    handleToggleProduct = () => {
        const { visibleProduct } = this.state;
        this.setState({ visibleProduct: !visibleProduct });
        const { dispatch, visible } = this.props;
        if (visible && !visibleProduct) {
            dispatch({ type: types.HIDE_TOPPANEL });
        }
    }
    handleToggleSave = () => {
        const { visibleSave } = this.state;
        this.setState({ visibleSave: !visibleSave, background: !visibleSave });
    }
    handleToggleEmail = () => {
        const url = `mailto:?subject=SHARE_EMAIL_SUBJECT&body=SHARE_EMAIL_BODY ${window.location.href}`;
        window.open(url, "sendemail", "width=400,height=400,top=150,left=270");
    }
    handleToggleFullScreen = () => {
        if (this.fullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
            this.fullScreen = false;
        }
        else {
            const elm = document.documentElement;
            if (elm.requestFullscreen) {
                elm.requestFullscreen();
            } else if (elm.webkitRequestFullscreen) { /* Safari */
                elm.webkitRequestFullscreen();
            } else if (elm.msRequestFullscreen) { /* IE11 */
                elm.msRequestFullscreen();
            }
            this.fullScreen = true
        }
    }
    render() {
        const { visibleRoom, selected, visibleLang, langLists, visibleProduct, visibleSave, background } = this.state;
        const langSelected = langLists.find(l => l._id === selected) || {};
        return (
            <>
                <div id="bottomPanelMenu">
                    <button className="bottom-menu-text" title="Chọn không gian" onClick={this.handleToggle}>Chọn không gian</button>
                    <span className={"dropup" + (visibleLang ? " open" : "")} style={{ position: 'static' }}>
                        <button title="Switch Language" className="dropdown-toggle" type="button" onClick={this.handleToggleLang}  >{langSelected.name}</button>
                        <ul id="bottomDropdownMenuMapsSize" className="dropdown-menu" style={{ left: 'unset', right: 0 }}>
                            {langLists.map(lang => {
                                return (
                                    <li key={lang._id} onClick={() => this.handleChooseLang(lang._id)}>
                                        <a href="#" className={selected === lang._id ? "selected" : ""}>
                                            <span className="glyphicon glyphicon-ok">
                                            </span>{"  " + lang.name}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </span>
                    <button title="Thông tin sản phẩm" onClick={this.handleToggleProduct}>
                        <img src="/icons/info.png" alt="" />
                    </button>
                    <button id="bottomMenuCapture" title="Lưu" onClick={this.handleToggleSave}>
                        <img src="/icons/capture.png" alt="" />
                    </button>
                    <button id="bottomMenuMail" title="E-mail Share" onClick={this.handleToggleEmail} >
                        <img src="/icons/mail.png" alt="" />
                    </button>
                    <button id="bottomMenuFullScreen" title="Toàn màn hình" onClick={this.handleToggleFullScreen}>
                        <img id="bottomMenuFullScreenImg" src="/icons/fullscreen.png" alt="" />
                        <img id="bottomMenuCancelFullScreenImg" src="/icons/normalscreen.png" alt="" />
                    </button>
                </div>
                <RoomSelect visible={visibleRoom} handleToggle={this.handleToggle} />
                <ProductInfoPanel visible={visibleProduct} handleToggle={this.handleToggleProduct} />
                <SaveModal visible={visibleSave} handleToggle={this.handleToggleSave} />
                <div className={"modal-backdrop fade in"} style={{ display: background ? 'block' : 'none' }}></div>
            </>
        )
    }
}

export default connect(({ app: { visible } }) => ({ visible }))(BottomPanel)