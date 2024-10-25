'use strict'

const e = React.createElement

class BtnSubscriberScan extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            subscribed: false,
            values: {
                min: -1,
                max: -1,
                mean: -1,
            }
        }
        this.subscriber = null
    }

    treatMessage = (msg) => {
        this.setState({
            values: {
                min: msg.ranges.reduce((acc, cur) => {
                    acc = cur < acc && cur !== null ? cur : acc
                    return acc
                }, 9999),
                max: msg.ranges.reduce((acc, cur) => {
                    acc = cur > acc && cur !== null ? cur : acc
                    return acc
                }, -1),
                mean: msg.ranges.reduce((acc, cur) => acc + cur, 0) / msg.ranges.length,
            }
        })
    }

    readOnceHandler = () => {
        let laserScanSubscriber = new ROSLIB.Topic({
            ros: this.props.ros,
            name: this.props.topic_name,
            messageType: 'sensor_msgs/LaserScan',
        })
        laserScanSubscriber.subscribe((msg) => {
            this.treatMessage(msg)
            laserScanSubscriber.unsubscribe()
        })
    }

    subscribeHandler = () => {
        // set state
        this.setState({
            subscribed: true
        })
        // set subscriber
        this.subscriber = new ROSLIB.Topic({
            ros: this.props.ros,
            name: this.props.topic_name,
            messageType: 'sensor_msgs/LaserScan',
        })
        this.subscriber.subscribe((msg) => {
            this.treatMessage(msg)
        })
    }

    stopSubscribingHandler = () => {
        // set state
        this.setState({
            subscribed: false
        })
        // turn subscriber off
        this.subscriber.unsubscribe()
        this.subscriber = null
    }

    render() {
        return (
            <div>
                <h3>{this.props.topic_name}</h3>
                <button disabled={this.state.subscribed || this.props.disabled} onClick={this.readOnceHandler}>Read once</button>
                {!this.state.subscribed && <button disabled={this.props.disabled} onClick={this.subscribeHandler}>Subscribe...</button>}
                {this.state.subscribed && <button onClick={this.stopSubscribingHandler}>Unsubscribe</button>}
                <hr />
                <h3>Values</h3>
                <div>
                    <p>Min: {this.state.values.min.toFixed(2)}</p>
                    <p>Max: {this.state.values.max.toFixed(2)}</p>
                    <p>Mean: {this.state.values.mean.toFixed(2)}</p>
                </div>

            </div>
        )
    }
}