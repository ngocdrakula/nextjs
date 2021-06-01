import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';


class RoomSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: types.USER_GET_MY_DESIGN,
        });
    }

    handleSelectRoom = (selected) => {
        this.setState({ selected });
    }

    render() {
        const { visible, handleToggle, rooms, layouts, user, designs } = this.props;
        const { selected = (designs.length && user?._id) || rooms[0]?._id } = this.state;
        return (
            <div
                id="dialogRoomSelect"
                className={"modal fade" + (visible ? " in" : "")}
                style={visible ? { display: 'block', paddingLeft: 16 } : {}}
                onClick={e => e.target.className === 'modal fade in' ? handleToggle() : null}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={handleToggle}>×</button>
                            <h3 className="modal-title">Chọn không gian</h3>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body">
                                <ul className="nav nav-tabs">
                                    {designs.length && user?._id ?
                                        <li className={"rooms-types" + (user._id === selected ? " active" : "")}>
                                            <a href="#" onClick={() => this.setState({ selected: user._id })}>Thiết kế của tôi</a>
                                        </li>
                                        : ''}
                                    {rooms.map(room => {
                                        return (
                                            <li key={room._id} className={"rooms-types" + (room._id === selected ? " active" : "")}>
                                                <a href="#" onClick={() => this.setState({ selected: room._id })}>{room.name}</a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="text-center rooms-select-list">
                                {designs.length && user?._id ?
                                    <div className="rooms-list-by-type" style={{ display: user._id === selected ? 'block' : 'none' }}>
                                        {designs.map(design => {
                                            return (
                                                <a key={design._id} href={`/design/${design._id}`} title={design.name} className="room-select-link">
                                                    <div className="room-image-holder">
                                                        <img src={"/api/images/" + design.image + "?width=512&height=288"} alt={design.name} />
                                                        <img src="/icons/2d.png" alt="" width={32} className="room-image-engine-icon" />
                                                    </div>
                                                    <p>{design.name}</p>
                                                </a>
                                            );
                                        })}
                                        <p><a href="/home" title="Trang cá nhân">Quản lý thiết kế</a></p>
                                    </div>
                                    : ''}
                                {rooms.map(room => {
                                    return (
                                        <div key={room._id} className="rooms-list-by-type" style={{ display: room._id === selected ? 'block' : 'none' }}>
                                            {layouts.map(layout => {
                                                if (layout.room._id !== room._id) return null;
                                                return (
                                                    <a key={layout._id} href={`/room2d/${layout._id}`} title={layout.name} className="room-select-link">
                                                        <div className="room-image-holder">
                                                            <img src={"/api/images/" + layout.images[0] + "?width=512&height=288"} alt={layout.name} />
                                                            <img src="/icons/2d.png" alt="" width={32} className="room-image-engine-icon" />
                                                        </div>
                                                        <p>{layout.name}</p>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={() => handleToggle()}>Hủy</button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ app: { rooms = [], layouts = [] }, user: { user, designs } }) => ({ rooms, layouts, user, designs }))(RoomSelect)