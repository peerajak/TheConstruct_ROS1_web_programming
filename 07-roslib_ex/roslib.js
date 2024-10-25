// Connecting to ROS
// -----------------

let ros
let rosbridge_address = 'wss://i-0125d8ba0d9c9554b.robotigniteacademy.com/a58a6cb8-586d-4c80-9f0c-19f0eb10e5f7/rosbridge/' // set default value here
let hadError = false

const connectToRos = () => {
    rosbridge_address = rosbridgeAddressTxt.value
    try {
        ros = new ROSLIB.Ros({
            url: rosbridge_address
        });
        ros.on('connection', function () {
            console.log('Connected to websocket server.');
            evaluateState(1)
        });
        ros.on('error', function (error) {
            console.log('Error connecting to websocket server: ', error);
            errorMsg.innerHTML = 'Error connecting to websocket server'
            evaluateState(2)
            hadError = true
        });
        ros.on('close', function () {
            console.log('Connection to websocket server closed.');
            if (hadError) {
                hadError = false
            } else {
                evaluateState(0)
            }
        });
    } catch (ex) {
        console.log(ex)
        errorMsg.innerHTML = ex
        evaluateState(2)
    }
}

const disconnect = () => {
    ros.close()
    evaluateState(0)
}

/*
0 - disconnected
1 - connected
2 - error
*/
const evaluateState = (state) => {
    console.log(`evaluate state ${state}`)
    switch (state) {
        case 0:
            // disconnected
            btnConnect.style.display = ""
            btnDisconnect.style.display = "none"
            errorMsg.style.display = "none"
            topicTxt.disabled = true
            linearXInput.disabled = true
            angularZInput.disabled = true
            btnSet.disabled = true
            btnStop.disabled = true
            break
        case 1:
            // connected
            btnConnect.style.display = "none"
            btnDisconnect.style.display = ""
            errorMsg.style.display = "none"
            topicTxt.disabled = false
            linearXInput.disabled = false
            angularZInput.disabled = false
            btnSet.disabled = false
            btnStop.disabled = false
            break
        case 2:
            // error
            btnConnect.style = ""
            btnDisconnect.style.display = "none"
            errorMsg.style.display = ""
            topicTxt.disabled = true
            linearXInput.disabled = true
            angularZInput.disabled = true
            btnSet.disabled = true
            btnStop.disabled = true
            break
        default:
            // do nothing
            break
    }

}

let btnConnect, btnDisconnect, errorMsg, form
let topicTxt, linearXInput, angularZInput
let btnSet, btnStop
let rosbridgeAddressTxt

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        // set elements
        btnConnect = document.getElementById("btn_connect")
        btnDisconnect = document.getElementById("btn_disconnect")
        errorMsg = document.getElementById("error_message")
        form = document.getElementById('form')

        topicTxt = document.getElementById('topic_name')
        linearXInput = document.getElementById('linear_x')
        angularZInput = document.getElementById('angular_z')

        btnSet = document.getElementById('btn_set')
        btnStop = document.getElementById('btn_stop')
        rosbridgeAddressTxt = document.getElementById('rosbridge_address')

        // set default rosbridge address
        rosbridgeAddressTxt.value = rosbridge_address

        // evaluate disconnected state
        evaluateState(0)

        // form submit event
        form.onsubmit = (e) => {
            e.preventDefault()
        }

        // connect btn event
        btnConnect.onclick = (e) => {
            connectToRos()
            e.preventDefault()
        }

        // disconnect btn event
        btnDisconnect.onclick = (e) => {
            disconnect()
            e.preventDefault()
        }

        // set robot btn event
        btnSet.onclick = (e) => {
            const x = +linearXInput.value
            const z = +angularZInput.value
            const topic = topicTxt.value
            sendTopicMsg(topic, x, z)
            e.preventDefault()
        }

        // stop robot btn event
        btnStop.onclick = (e) => {
            const topic = topicTxt.value
            sendTopicMsg(topic, 0, 0)
            e.preventDefault()
        }
    }
}

const sendTopicMsg = (topic_name, x, z) => {
    let topic = new ROSLIB.Topic({
        ros: ros,
        name: topic_name,
        messageType: 'geometry_msgs/Twist'
    })
    let msg = new ROSLIB.Message({
        linear: { x, y: 0, z: 0 },
        angular: { x: 0, y: 0, z },
    })
    topic.publish(msg)
}

// end
