import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';


class MessageCustomer extends Component {
  state = {}
  constructor(props) {
    super(props);
    this.state = {};
    this.mesContainer = React.createRef();
  }
  componentDidMount() {
    this.checkHeight();
    window.addEventListener('resize', this.checkHeight);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkHeight);
  }
  openLoginVisitor = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPENFORM, payload: MODE.visitor });
  }
  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPEN_MESSAGE })
  }
  checkHeight = () => {
    const mesContainer = this.mesContainer?.current
    if (mesContainer) {
      const windowHeight = window.innerHeight;
      const headerHeight = 80;
      const headerTopHeight = 30;
      mesContainer.style.height = `${windowHeight - headerHeight - headerTopHeight - 10}px`;
    }
  }
  render() {
    const { openMessage, admin } = this.props;
    return (
      <div className="mesContainer" className={"mesContainer" + (openMessage ? " open" : "")} ref={this.mesContainer}>
        <div className="mesContainerHead">
          <div className="mesContainerTitle">Tin nhắn</div>
          <div className="closeButton" onClick={this.handleClose} title="Đóng">-</div>
        </div>
        <div className="mes-admin-info">
          <div className="mes-admin-logo">
            {admin?.avatar ?
              <img src={"/api/images/" + admin.avatar} className="mes-admin-avatar" />
              :
              <img src="/images/user2.png" className="mes-admin-default" />
            }
          </div>
          <div className="mes-admin-status">
            <div className="mes-admin-name">
              {admin?.name}
            </div>
            <div className="mes-admin-onl">
              (Online)
            </div>
          </div>
        </div>
        <div className="mes-login-container">
          <div className="mes-login">
            <div className="mes-log-des">Chúng ta chỉ còn một bước nữa thôi!<br /> Vui lòng đăng nhập để bắt đầu cuộc trò chuyện </div>
            <div className="mes-log-button" onClick={this.openLoginVisitor}>Đăng nhập</div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ app: { openMessage, admin } }) => ({ openMessage, admin }))(MessageCustomer);