'use strict';

const e = React.createElement;

class RosPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            robotState: '-',
        }
        this.pingInterval = null
    }

    componentDidMount() {
        // subscribe every 15 seconds
        this.pingInterval = setInterval(() => {
            var listener = new ROSLIB.Topic({
                ros: this.props.ros,
                name: '/any_topic',
                messageType: 'std_msgs/String'
            })
            listener.subscribe()

            // unsubscribe after 1 second
            setTimeout(() => {
                listener.unsubscribe()
            }, 1 * 1000)
        }, 15 * 1000)

        console.log('RosPanel was mounted')
    }

    componentWillUnmount() {
        console.log('About to be removed!')
        clearInterval(this.pingInterval)
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