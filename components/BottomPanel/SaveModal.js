import React, { Component } from 'react'

export default class SaveModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleSave = () => {
        console.log('save')
    }
    render() {
        const { visible, handleToggle } = this.props;
        return (
            <div
                className={"modal fade" + (visible ? " in" : "")}
                style={visible ? { display: 'block', paddingLeft: 16 } : {}}
                onClick={e => e.target.className === 'modal fade in' ? handleToggle() : null}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={handleToggle}>×</button>
                            <h3 className="modal-title">Lưu</h3>
                        </div>
                        <div className="modal-body text-center">
                            <button className="dialog-modal-box-button" onClick={handleToggle}>Lưu dưới dạng ảnh</button>
                            <button className="dialog-modal-box-button" onClick={handleToggle}>Lưu dưới dạng  PDF</button>
                            <button className="dialog-modal-box-button" onClick={handleToggle}>Lưu vào tài  khoản</button>
                            <div className="social-share">
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={handleToggle}>Hủy</button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
