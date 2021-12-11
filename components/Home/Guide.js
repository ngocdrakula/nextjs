import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import { translate } from '../../utils/language';

class Guide extends Component {
    render() {
        return (
            <div id="guide">
                <div className="main-title hd-bg-blue">
                    <h2 className="heading">{translate(langConfig.app.InstructionsParticipating)}</h2>
                    <div className="heading-bottom"><img src="/images/heading-bottom-guide.png" alt="" /></div>
                    <div className="container">
                        <div className="row guide-steps">
                            <div className="col-sm-4">
                                <div className="step-item">
                                    <img src="/images/step1.png" alt="" />
                                    <p><span>{translate(langConfig.app.Step)} 1</span>{translate(langConfig.app.RegisterVisitorAccount)}</p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="step-item">
                                    <img src="/images/step2.png" alt="" />
                                    <p><span>{translate(langConfig.app.Step)} 2</span>{translate(langConfig.app.ReceiveEmailFromOrganizer)}</p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="step-item">
                                    <img src="/images/step3.png" alt="" />
                                    <p><span>{translate(langConfig.app.Step)} 3</span>{translate(langConfig.app.VisitBooth)}. <br />{translate(langConfig.app.ConnectExhibitors)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Guide)
