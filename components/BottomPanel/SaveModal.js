import React, { Component } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;



export default class SaveModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleSave = () => {
        const { handleToggle } = this.props;
        handleToggle();
        const fileName = `${process.env.TITLE} - Product Info`;
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
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }));
        if (canvas) {
            toDataURL('/icons/logo.png').then(logo => {
                // content.push({
                //     image: logo,
                //     alignment: 'center',
                //     width: pageSize.width * .2,
                //     margin: [0, 0, 0, 10],
                //     pageBreak: null
                // });
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
            })
        }
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
                            <button className="dialog-modal-box-button" onClick={this.handleSave}>Lưu dưới dạng ảnh</button>
                            <button className="dialog-modal-box-button" onClick={this.handleSavePDF}>Lưu dưới dạng  PDF</button>
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
