import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import { translate } from '../../utils/language';

class Partner extends Component {
    render() {
        return (
            <div id="partner">
                <div className="container">
                    <div className="row partner-info">
                        <div className="col-md-6">
                            <div className="row" style={{ marginBottom: 10 }}>
                                <div className="col-sm-4">
                                    <p>{translate(langConfig.app.DirectingAgency)}:</p>
                                </div>
                                <div className="col-sm-8">
                                    <p>{translate(langConfig.app.MINISTRYOFINDUSTRYANDTRADE)}</p>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: 10 }}>
                                <div className="col-sm-4">
                                    <p>{translate(langConfig.app.TheHostInstitution)}:</p>
                                </div>
                                <div className="col-sm-8">
                                    <p>{translate(langConfig.app.DepartmentIndustry)}</p>
                                    <p>{translate(langConfig.app.IndustrialDevelopment)}</p>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: 10 }}>
                                <div className="col-sm-4">
                                    <p>{translate(langConfig.app.OrganizationalUnits)}:</p>
                                </div>
                                <div className="col-sm-8">
                                    <p>{translate(langConfig.app.QCHCCompanyCISVietnamExhibition)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="partner-logo">
                                <img src="/images/partner1.png" alt="" />
                                <img src="/images/partner2.png" alt="" />
                                <img src="/images/partner3.png" alt="" />
                                <img src="/images/partner4.png" alt="" />
                            </div>
                        </div>
                        <div className="col-md-6 mt-56">
                            <p>{translate(langConfig.app.CoordinationUnit)}:</p>
                            <img src="/images/support1.png" alt="" style={{ display: 'block', margin: '0 auto 15px' }} />
                            <img src="/images/support2.png" alt="" />
                        </div>
                        <div className="col-md-6 mt-56">
                            <p>{translate(langConfig.app.InformationSupport)}:</p>
                            <img src="/images/support3.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(() => ({}))(Partner)
