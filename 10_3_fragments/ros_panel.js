'use strict';

const e = React.createElement;

class RosPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            robotState: '-',
        }
    }

    robotCircles = () => {
        this.setState({
            robotState: 'running in circles...'
        })
    }

    robotStop = () => {
        this.setState({
            robotState: 'stopped'
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="column-50">
                    <h3>Robot actions</h3>
                    <p>Robot is {this.state.robotState}</p>
                    <BtnPublisher
                        clicked={this.robotCircles}
                        ros={this.props.ros}
                        topic_name='/cmd_vel'
                        topic_type='geometry_msgs/Twist'
                        topic_message={{ linear: { x: 0.5 }, angular: { z: 0.5 } }}
                        disabled={!this.props.connected}
                    >
                        Run in circles
                    </BtnPublisher>
                    <br />
                    <BtnPublisher
                        clicked={this.robotStop}
                        ros={this.props.ros}
                        topic_name='/cmd_vel'
                        topic_type='geometry_msgs/Twist'
                        topic_message={{ linear: { x: 0 }, angular: { z: 0 } }}
                        disabled={!this.props.connected}
                    >
                        Stop!
                    </BtnPublisher>
                </div>

                <div className="column-50">
                    <h3>Sensors</h3>
                    <BtnSubscriberScan
                        ros={this.props.ros}
                        topic_name='/scan'
                        disabled={!this.props.connected}
                    />
                </div>
            </React.Fragment>
        )
    }
}