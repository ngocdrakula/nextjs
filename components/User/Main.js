import React, { Component } from 'react'
import { connect } from 'react-redux'
import types from '../../redux/types';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selecteds: []
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.USER_GET_MY_DESIGN });
    }
    componentDidUpdate(prevProps) {
        if (this.props.designs.length && this.props.designs !== prevProps.designs) {
            this.setState({ selecteds: [] })
        }
    }
    handleChange = id => {
        const { selecteds } = this.state;
        if (selecteds.includes(id)) {
            this.setState({ selecteds: selecteds.filter(i => i !== id) })
        }
        else {
            selecteds.push(id);
            this.setState({ selecteds })
        }
    }
    handleDelete = id => {
        this.setState({ visible: true, id })
    }
    handleDeleteMulti = () => {
        this.setState({ visible: true, dropdown: false })
    }
    handleConfirm = () => {
        const { dispatch } = this.props;
        const { id, selecteds } = this.state;
        if (id) {
            dispatch({
                type: types.USER_DELETE_DESIGN,
                payload: id,
                callback: res => {
                    if (res?.success) {
                        this.setState({ visible: false, id: null });
                    }
                    else {
                        this.setState({ error: true });
                    }
                }
            })
        }
        else {
            dispatch({
                type: types.USER_DELETE_MUTIL_DESIGN,
                payload: selecteds,
                callback: res => {
                    if (res?.success) {
                        this.setState({ visible: false, selecteds: [] });
                        dispatch({ type: types.USER_GET_MY_DESIGN });
                    }
                    else {
                        this.setState({ error: true });
                    }
                }
            })
        }
    }

    render() {
        const { designs } = this.props;
        const { selecteds, visible, dropdown, id } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <div id="confirmDialog" role="dialog" className={"modal fade" + (visible ? " in" : "")} style={{ display: visible ? 'block' : 'none', paddingRight: 16 }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" data-dismiss="modal" className="close">×</button>
                                        <h4 id="confirmDialogHeader" className="modal-title">Xác nhận xóa thiết kế</h4>
                                    </div>
                                    <div className="modal-body">
                                        {id ?
                                            <p id="confirmDialogText">Bạn có chắc chắn mốn xóa thiết kế này.</p>
                                            :
                                            <p id="confirmDialogText">Bạn có chắc chắn mốn xóa {selecteds.length} thiết kế.</p>
                                        }
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={this.handleConfirm} className="btn btn-primary">Xác nhận</button>
                                        <button type="button" onClick={() => this.setState({ visible: false })} className="btn btn-default">Hủy</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className={"dropdown pull-right" + (dropdown ? " open" : "")}>
                                <button type="button" className="btn btn-default btn-sm dropdown-toggle" onClick={() => selecteds.length ? this.setState({ dropdown: !dropdown }) : null}>Tùy chọn <span className="caret" /></button>
                                <ul className="dropdown-menu">
                                    <li><a href="#" onClick={this.handleDeleteMulti}>Xóa {selecteds.length} mục</a></li>
                                </ul>
                            </div>
                            <h3 className="panel-heading">Danh sách thiết kế</h3>
                            <div className="panel-body">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Không gian</th>
                                            <th colSpan={1}>Loại</th>
                                            <th colSpan={1}>Đường dẫn</th>
                                            <th>Note</th>
                                            <th colSpan={3}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {designs.map(design => {
                                            const checked = selecteds.includes(design._id) ? "checked" : "";
                                            return (
                                                <tr key={design._id}>
                                                    <td className="table-text">{design.name}</td>
                                                    <td className="table-text">
                                                        <img src={"/api/images/" + design.image + "?width=512&height=288"} alt={design.name} style={{ maxWidth: 128, maxHeight: 100 }} />
                                                    </td>
                                                    <td className="table-text">
                                                        <a href={`/design?id=${design._id}`} title={`/design?id=${design._id}`} >
                                                            <img src="/icons/2d.png" width={32} />
                                                        </a>
                                                    </td>
                                                    <td className="table-text">
                                                        <a href={`/design?id=${design._id}`} >{design._id}</a>
                                                    </td>
                                                    <td className="table-text" />
                                                    <td className="table-text">
                                                        <input type="checkbox" checked={checked} onChange={() => this.handleChange(design._id)} />
                                                    </td>
                                                    <td className="table-text">
                                                        <button type="button" onClick={() => this.handleDelete(design._id)} title="Xoá thiết kế" className="close">×</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className="page-links" style={{ textAlign: 'center' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ user: { user, designs } }) => ({ user, designs }))(Main)
