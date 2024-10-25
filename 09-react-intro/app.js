'use strict';

const e = React.createElement;

let ros = null

class AppComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            connected: false,
            robotState: '-',
        }
    }
    name = 'React.js component'

    robotState = 'Stopped'
    connectToRosbridge = () => {
        try {
            ros = new ROSLIB.Ros({
                url: document.getElementById('rosbridge_address').value
            })
        } catch (ex) {
            console.log(ex)
            //
        }
        ros.on('connection', () => {
            console.log('Connected to websocket server.')
            this.setState({ connected: true })
        })
        ros.on('error', (error) => {
            console.log('Error connecting to websocket server: ', error)
        })
        ros.on('close', () => {
            console.log('Connection to websocket server closed.')
            this.setState({ connected: false })
        })
    }
    disconnectRosbridge = () => {
        ros.close()
    }
    robotCircles = () => {
        let topic = new ROSLIB.Topic({
            ros: ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        })
        let msg = new ROSLIB.Message({
            linear: { x: 0.5 },
            angular: { z: 0.5 },
        })
        topic.publish(msg)
        this.setState({
            robotState: 'running in circles...'
        })
    }
    robotStop = () => {
        let topic = new ROSLIB.Topic({
            ros: ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        })
        let msg = new ROSLIB.Message({
            linear: { x: 0 },
            angular: { z: 0 },
        })
        topic.publish(msg)
        this.setState({
            robotState: 'stopped'
        })
    }
    render() {
        return (
            <div>
                <div>
                    <h2>Hello from {this.name}</h2>
                </div>

                <div>
                    <label>Enter your rosbridge address</label>
                    <br />
                    <input disabled={this.state.connected} type="text" id="rosbridge_address" />
                    <br />
                    {!this.state.connected && <button onClick={this.connectToRosbridge}>Connect</button>}
                    {this.state.connected && <button onClick={this.disconnectRosbridge}>Disconnect</button>}
                </div>

                <div>
                    <h3>Robot actions</h3>
                    <p>Robot is {this.state.robotState}</p>
                    <button disabled={!this.state.connected} onClick={this.robotCircles}>Run in circles</button>
                    <br />
                    <button disabled={!this.state.connected} onClick={this.robotStop}>Stop</button>
                </div>
            </div>
        )
    }
}

const appContainer = document.querySelector('#app')
ReactDOM.render(e(AppComponent), appContainer)