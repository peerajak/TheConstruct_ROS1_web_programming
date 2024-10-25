jsx
'use strict'

const e = React.createElement

class BtnPublisher extends React.Component {
    constructor(props) {
        super(props)
    }

    onClickHandler = () => {
        // tell parent button was clicked
        this.props.clicked()

        // publish
        let topic = new ROSLIB.Topic({
            ros: this.props.ros,
            name: this.props.topic_name,
            messageType: this.props.topic_type
        })
        let msg = new ROSLIB.Message(this.props.topic_message)
        topic.publish(msg)
    }

    render() {
        return (
            <button onClick={this.onClickHandler} disabled={this.props.disabled}>
                {this.props.children}
            </button>
        )
    }
}