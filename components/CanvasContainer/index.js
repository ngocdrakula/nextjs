import React, { Component } from 'react';
import { connect } from 'react-redux';
import ThreeJS from './ThreeJS';

class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    render() {
        const { loading } = this.props;
        return (
            <div id="container" className="room-canvas-container" style={{}}>
                <ThreeJS />
                <div id="loadAnimationContainer" style={!loading ? { display: 'none' } : {}}>
                    <p>Applying Tiles</p>
                    <div className="circles marginLeft">
                        <span className="circle_1 circle">
                        </span>
                        <span className="circle_2 circle">
                        </span>
                        <span className="circle_3 circle">
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(() => ({}))(CanvasContainer)