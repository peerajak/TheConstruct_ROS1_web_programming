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

    render() {
        return (
            <div>
                <div>
                    <h2>Hello from {this.name}</h2>
                </div>

                <div>
                    <label>Enter your rosbridge address</label>
                    <br />
                    <input
                        disabled={this.state.connected}
                        type="text"
                        id="rosbridge_address"
                        defaultValue="wss://i-03bce27859a74f680.robotigniteacademy.com/c0c501ae-dcbc-420a-8596-bfa6daaba794/rosbridge/" />
                    <br />
                    {!this.state.connected && <button onClick={this.connectToRosbridge}>Connect</button>}
                    {this.state.connected && <button onClick={this.disconnectRosbridge}>Disconnect</button>}
                </div>

                {this.state.connected && <RosPanel ros={ros} connected={this.state.connected} />}
            </div>
        )
    }
}

const appContainer = document.querySelector('#app')
ReactDOM.render(e(AppComponent), appContainer)