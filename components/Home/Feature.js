import React, { Component } from 'react'
import { connect } from 'react-redux';


const icons = [
    "/images/account.png",
    "/images/finding.png",
    "/images/chat.png",
    "/images/live.png",
    "/images/shop-online.png",
    "/images/system-admin.png"
];

class Feature extends Component {
    render() {
        const { setting } = this.props;
        const { featureStatus, featuresTitle, features } = setting;
        if (!featureStatus) return null;
        return (
            <div id="features">
                <div className="container">
                    <h2 className="heading">{featuresTitle}</h2>
                    <div className="heading-bottom"><img src="/images/heading-bottom.png" alt="" /></div>
                    <div className="features-list">
                        <div className="row">
                            {features?.map((feature, index) => {
                                const icon = icons[index % 6];
                                return (
                                    <div key={index} className="col-sm-6 col-lg-4">
                                        <div className="feature-item">
                                            <img src={icon} alt="" />
                                            <div>
                                                <h3>{feature.title}</h3>
                                                <p>{feature.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ app: { setting } }) => ({ setting }))(Feature)
