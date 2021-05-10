import React, { Component } from 'react';
import { connect } from 'react-redux';
import { convertLayout } from '../../datas/convertLayout';
import room1 from '../../datas/room1';
import room2 from '../../datas/room2';
import types from '../../redux/types';


class RoomSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleSelectRoom = (selected) => {
        this.setState({ selected });
    }

    render() {
        const { visible, handleToggle, rooms, layouts } = this.props;
        const { selected = rooms[0]?._id } = this.state;
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
                                    {rooms.map((room, index) => {
                                        return (
                                            <li key={room._id} className={"rooms-types" + (room._id === selected ? " active" : "")}>
                                                <a href="#" onClick={() => this.setState({ selected: room._id })}>{room.name}</a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="text-center rooms-select-list">
                                {rooms.map(room => {
                                    return (
                                        <div key={room._id} className="rooms-list-by-type" style={{ display: room._id === selected ? 'block' : 'none' }}>
                                            {layouts.map((layout, index) => {
                                                if (layout.room._id !== room._id) return null;
                                                return (
                                                    <a key={layout._id} href={`/room2d/${layout._id}`} title={layout.name} className="room-select-link">
                                                        <div className="room-image-holder">
                                                            <img src={"/api/images/" + layout.images[0]} alt={layout.name} />
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

export default connect(({ app: { rooms = [], layouts = [] } }) => ({ rooms, layouts }))(RoomSelect)