import React, { Component } from 'react';
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { translate } from '../../utils/language';
import ConversationList from './ConversationList';
import MessageBox from './MessageBox';

const pageSize = 10;

class MessageContainer extends Component {
  state = {}
  constructor(props) {
    super(props);
    this.state = {}
    this.mesContainer = React.createRef();
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: types.GET_CONVERSATIONS,
      payload: {
        page: 0,
        pageSize
      }
    });
    this.checkHeight();
    window.addEventListener('resize', this.checkHeight);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkHeight);
  }
  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPEN_MESSAGE })
  }
  handleOpenList = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPEN_LIST });
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
    const { openMessage, openList } = this.props;
    return (
      <div className={"mesContainer" + (openMessage ? " open" : "")} ref={this.mesContainer}>
        <div className="mesContainerHead">
          <div className="mesContainerTitle">{translate(langConfig.app.Messages)}</div>
          <div className="closeButton" onClick={this.handleClose} title="Đóng">-</div>
        </div>
        <div className="mesTask">
          <div className={"mesTaskItem" + (openList ? " active" : "")} onClick={!openList ? this.handleOpenList : undefined}>
            <img src="/images/chat2.png" />
          </div>
          <div className={"mesTaskItem filter-blue" + (!openList ? " active" : "")} onClick={openList ? this.handleOpenList : undefined}>
            <img src="/images/user.png" />
          </div>
        </div>
        <MessageBox />
        <ConversationList />
      </div>
    );
  }
}

export default connect(({ app: { openMessage, openList, user } }) => ({ openMessage, openList, user }))(MessageContainer);