import React, { Component } from 'react';
import { connect } from 'react-redux';
import ThreeJS from './ThreeJS';


class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { loading } = this.props;
        return (
            <div id="container" className="room-canvas-container" style={{}}>
                <canvas id="roomCanvas" className="room-canvas" style={{ cursor: 'unset', background: '#dddddd' }} />
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
                <ThreeJS />
            </div>
        )
    }
}
export default connect(({ app: { loading } }) => ({ loading }))(CanvasContainer);