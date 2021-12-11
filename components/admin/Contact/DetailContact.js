import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../../lang.config';
import { translate } from '../../../utils/language'


class DetailContact extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { onView, handleClose } = this.props;
        return (
            <div
                id="myDynamicModal"
                className={"modal-create modal fade" + (onView ? " in" : "")}
                style={{ display: onView ? 'block' : 'none' }}
                onClick={e => e.target.className === "modal-create modal fade in" ? handleClose() : null}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={handleClose}>×</button>
                            {translate(langConfig.app.MessageDetails)}
                        </div>
                        <div className="modal-body contact-detail">
                            <table className="table no-border">
                                <tbody>
                                    <tr>
                                        <th className="text-right">{translate(langConfig.app.Name)}:</th>
                                        <td style={{ width: '85%' }}>{onView?.name}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-right">{translate(langConfig.app.Email)}:</th>
                                        <td style={{ width: '85%' }}>
                                            <a href={"mailto:" + onView?.email} target="_blank" title={translate(langConfig.app.SendEmail)}>{onView?.email}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right">{translate(langConfig.app.Subject)}: </th>
                                        <td style={{ width: '85%' }}>{onView?.title}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-right">{translate(langConfig.app.Content)}</th>
                                        <td style={{ width: '85%' }}>{onView?.message}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ }) => ({}))(DetailContact)
