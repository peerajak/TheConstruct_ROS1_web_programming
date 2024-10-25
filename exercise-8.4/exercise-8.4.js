// Connecting to ROS
// -----------------

let ros
let btnConnect, btnCircles, btnAhead, btnStop, btnScan
let txtRosbridgeAddress
let msgError


const connect = (e) => {
    e.preventDefault()
    console.log(txtRosbridgeAddress.value)
    try {
        ros = new ROSLIB.Ros({
            url: txtRosbridgeAddress.value
        });
    } catch (ex) {
        evalState(2, 'Check if you entered a valid address')
    }
    ros.on('connection', function () {
        console.log('Connected to websocket server.');
        evalState(1)
    });
    ros.on('error', function (error) {
        evalState(2, error)
        console.log('Error connecting to websocket server: ', error);
    });
    ros.on('close', function () {
        evalState(0)
        console.log('Connection to websocket server closed.');
    });
}
const evalState = (state, err = null) => {
    if (state == 1) {
        btnCircles.disabled = false
        btnAhead.disabled = false
        btnStop.disabled = false
        btnScan.disabled = false
        msgError.innerHTML = ''
    } else {
        btnCircles.disabled = true
        btnAhead.disabled = true
        btnStop.disabled = true
        btnScan.disabled = true
        msgError.innerHTML = ''
        if (state == 2) {
            msgError.innerHTML = err
        }
    }
}
const circles = (e) => {
    e.preventDefault()
    sendTopicMsg(0.5, 0.5)
}
const ahead = (e) => {
    e.preventDefault()
    sendTopicMsg(0.3, 0)
}
const stop = (e) => {
    e.preventDefault()
    sendTopicMsg(0.0, 0)
}
const scan = (e) => {

    var listener = new ROSLIB.Topic({
        ros : ros,
        name : '/scan',
        messageType : 'sensor_msgs/LaserScan'
    })
    console.log('scan butto pressed ');
    //TODO subscribe the /scan topic and get the message to display.

    listener.subscribe(function scan_handler(message) {
        //maxrange = Math.max(...message.ranges)
        //minrange = Math.min(...message.ranges)
        let adding = (a, b) => a + b;
        number_of_ranges = Math.ceil((message.angle_max - message.angle_min)/message.angle_increment)
        meanrange = message.ranges.reduce(adding)/number_of_ranges
        console.log('Received min Range: ' + String(message.range_min) + ', max range: '+ String(message.range_max) + ', mean range: ' + meanrange);
       
        // meanrange = Math.mean(...message.ranges)
        listener.unsubscribe();
        spanmaximum.textContent = String(message.range_max);
        spanminimum.textContent = String(message.range_min);
        spanmean.textContent = String(meanrange);
    })
    
    



}
const sendTopicMsg = (x, z) => {
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
    })
    var msg = new ROSLIB.Message({
        linear: { x, y: 0, z: 0 },
        angular: { x: 0, y: 0, z },
    })
    topic.publish(msg)
}

// set events
document.onreadystatechange = () => {
    btnConnect = document.getElementById('btnConnect')
    btnCircles = document.getElementById('btnCircles')
    btnAhead = document.getElementById('btnAhead')
    btnStop = document.getElementById('btnStop')
    btnScan = document.getElementById('btnScan')

    txtRosbridgeAddress = document.getElementById('txt_rosbridge_address')

    msgError = document.getElementById('msg_error')
    spanmaximum = document.getElementById("maximum");
    spanminimum = document.getElementById("minimum");
    spanmean = document.getElementById("mean");
    evalState(0)

    if (document.readyState == 'complete') {
        btnConnect.onclick = connect
        btnCircles.onclick = circles
        btnAhead.onclick = ahead
        btnStop.onclick = stop
        btnScan.onclick = scan
    }
}