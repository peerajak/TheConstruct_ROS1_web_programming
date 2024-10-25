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
                        defaultValue="wss://i-061b850fec55eabae.robotigniteacademy.com/3a49879a-bf56-45d7-a4a8-dca1ec7cc8da/rosbridge/" />
                    <br />
                    {!this.state.connected && <button onClick={this.connectToRosbridge}>Connect</button>}
                    {this.state.connected && <button onClick={this.disconnectRosbridge}>Disconnect</button>}
                </div>
                jsx
                {this.state.connected && <RosPanel ros={ros} connected={this.state.connected} />}
            </div>
        )
    }
}

const appContainer = document.querySelector('#app')
ReactDOM.render(e(AppComponent), appContainer)