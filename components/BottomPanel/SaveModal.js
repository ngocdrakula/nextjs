import React, { Component } from 'react';
import { connect } from 'react-redux'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import types from '../../redux/types';
import { createFormData } from '../../utils/helper';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class SaveModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.setState({ origin: window.location.origin });
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            this.setState({ saved: false });
        }
    }
    handleSave = () => {
        const { handleToggle } = this.props;
        handleToggle();
        const fileName = `${process.env.TITLE} - Product Info.jpeg`;
        const canvas = document.getElementById('roomCanvas');
        if (canvas) {
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(canvas.msToBlob(), fileName);
            } else {
                var a = document.createElement('a');
                a.href = canvas.toDataURL('image/jpeg');
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
            }
        }
    }
    handleSavePDF = () => {
        const content = [];
        const pageSize = { width: 600, height: 900 };
        const pageMargins = [35, 40, 35, 40];
        const fileName = `${process.env.TITLE} - Product Info.pdf`;
        const canvas = document.getElementById('roomCanvas');
        const toDataURL = url => fetch(url)
            .then(response => { if (response.data) return response.blob() })
            .then(blob => new Promise((resolve, reject) => {
                if (blob) {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = () => reject(null)
                    reader.readAsDataURL(blob)
                }
                else reject(null)
            }));
        if (canvas) {
            toDataURL('api/images/logo.png').then(logo => {
                if (logo) {
                    content.push({
                        image: logo,
                        alignment: 'center',
                        width: pageSize.width * .2,
                        margin: [0, 0, 0, 10],
                        pageBreak: null
                    });
                }
                //SAVE WIDTH LOGO
                const roomImage = canvas.toDataURL('image/jpg');

                content.push({
                    image: roomImage,
                    alignment: 'center',
                    width: pageSize.width * .86,
                    pageBreak: null
                });
                const docDefinition = {
                    pageSize,
                    content: content,
                    pageMargins,
                };
                pdfMake.createPdf(docDefinition).download(fileName);
            }).catch(e => {
                //SAVE WIDTHOUT LOGO
                const roomImage = canvas.toDataURL('image/jpg');

                content.push({
                    image: roomImage,
                    alignment: 'center',
                    width: pageSize.width * .86,
                    pageBreak: null
                });
                const docDefinition = {
                    pageSize,
                    content: content,
                    pageMargins,
                };
                pdfMake.createPdf(docDefinition).download(fileName);
            })
        }
    }
    handleSaveUser = () => {
        const { layout, areasCustom, dispatch, design } = this.props;
        if (layout?.areas && areasCustom) {
            const areas = layout.areas.map((area, index) => {
                const { custom, product, products, paint, grout, color, customRotate, skewType, skewValue, rotate } = area;
                return {
                    custom, product, products, paint, grout, color, customRotate, skewType, skewValue, rotate,
                    design: areasCustom[index]
                }
            });
            const canvas = document.getElementById('roomCanvas');
            if (canvas) {
                canvas.toBlob(file => {
                    const data = {
                        areas: JSON.stringify(areas),
                        name: layout.name,
                        layoutId: layout._id,
                        enable: true,
                        files: [file],
                        imageType: 'jpeg',
                    }
                    const formData = createFormData(data);
                    if (design) {
                        dispatch({
                            type: types.USER_UPDATE_DESIGN,
                            payload: { _id: design._id, formData },
                            callback: result => {
                                if (result?.success) {
                                    this.setState({ saved: true, _id: result.data?._id });
                                    localStorage.setItem('design', result.data?._id || '');
                                }
                            }
                        });
                    }
                    else {
                        dispatch({
                            type: types.USER_ADD_DESIGN,
                            payload: formData,
                            callback: result => {
                                if (result?.success) {
                                    this.setState({ saved: true, _id: result.data?._id });
                                    localStorage.setItem('design', result.data?._id || '');
                                }
                            }
                        });
                    }
                }, "image/jpeg", 0.5)
            }
        }
    }

    render() {
        const { visible, handleToggle, user, design } = this.props;
        const { saved, _id, origin } = this.state
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
                            <h3 className="modal-title">{saved ? 'Lưu thành công' : 'Lưu'}</h3>
                        </div>
                        {saved ?
                            <div className="modal-body">
                                <h4>Url to your room</h4>
                                <input type="text" value={origin + "/design?id=" + (design?._id || _id || '')} className="form-control" onClick={e => e.target.select()} readOnly style={{ marginBottom: 10 }} />
                                <div className="text-right">
                                    <button type="button" className="btn btn-default">Lưu dấu trang</button>
                                    <a href={"/design?id=" + (design?._id || _id || '')} className="btn btn-default" role="button" style={{ display: user?._id ? 'none' : 'inline-block', marginLeft: 5 }}>Thiết kế của bạn</a>
                                    <a href="/home" className="btn btn-primary" role="button" style={{ display: user?._id ? 'none' : 'inline-block', marginLeft: 5 }}>Đăng nhập</a>
                                </div>
                                <h4>Share</h4>
                                <div className="text-center">
                                    <div className="social-share">
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="modal-body text-center">
                                <button className="dialog-modal-box-button" onClick={this.handleSave}>Lưu dưới dạng ảnh</button>
                                <button className="dialog-modal-box-button" onClick={this.handleSavePDF}>Lưu dưới dạng  PDF</button>
                                <button className="dialog-modal-box-button" onClick={this.handleSaveUser}>Lưu vào tài  khoản</button>
                                <div className="social-share">
                                </div>
                            </div>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={handleToggle}>Hủy</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(({ app: { layout, areasCustom }, user: { user, design } }) => ({ layout, areasCustom, user, design }))(SaveModal)

