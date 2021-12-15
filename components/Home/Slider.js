import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getLocale } from '../../utils/language';

class Slider extends Component {
    render() {
        const setting = this.props.setting[getLocale()] || {};
        const { bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime, bannerLocation,
            bannerSlogan, bannerDescription, bannerBackground, bannerUpdated, bannerLogoThumb } = setting;
        if (!bannerStatus) return null;
        const image = `${bannerUpdated ? "/api" : ""}/images/${bannerLogoThumb}`;
        const link = "https://vimexpo.com.vn/slider/";
        return (
            <div className="livestream-video" dangerouslySetInnerHTML={{
                __html:
                    `<iframe
                        src="${link}"
                        width="100%"
                        height="660px"
                        style="border:none;overflow:hidden;min-height:660px"
                        scrolling="no"
                        frameborder="0"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowfullScreen={true}
                    ></iframe>`
            }} />
        )
        return (
            <div id="slider" style={bannerBackground ? { backgroundColor: bannerBackground } : {}}>
                <div className="container banner-container" style={{ backgroundImage: `url(${image})` }}>
                    <div className="slide-text">
                        <h1>{bannerSubTitle}<span>{bannerTitle}</span></h1>
                        <div className="time-location">
                            <p className="time">{bannerStartTime} - {bannerEndTime}</p>
                            <p className="location">{bannerLocation?.split('\n').map((d, i) => <React.Fragment key={i}>{i ? <br /> : ""}{d}</React.Fragment>)}</p>
                        </div>
                        <p className="txt-white">{bannerSlogan}</p>
                        <p className="txt-last">{bannerDescription?.split('\n').map((d, i) => <React.Fragment key={i}>{i ? <br /> : ""}{d}</React.Fragment>)}</p>
                    </div>
                </div>
            </div >
        );
    }
}

export default connect(({ app: { setting } }) => ({ setting }))(Slider)
