var five = require('johnny-five')
var twilio = require('twilio')

var board
var init = false
var trips = 0
var isArmed = false

var armButton
var resetButton
var statusLight

var ultraSensor
var ultraBaseline
var ultraReadings = [ ]
var ultraThreshold = 24
var ultraTriggered = false

var magnetSensor
var magnetTriggered = false

var photoSensor
var photoReading = 0
var photoThreshold = 100
var photoTriggered = false

var accountSid = 'AC4a15b85283a3d7f79395276ffc805970'
var authToken = 'f5cb23e4cfdf522277b510541ee30468'
var client = twilio(accountSid, authToken)
var lastSMS = 0
var ratelimit = 5000

board = new five.Board()
board.on('ready', function ready() {
	
	armButton = new five.Button({

		isPullup : true
		, pin : 8
	})
	armButton.on('up', armDisarm)

	resetButton = new five.Button({

		isPullup : true
		, pin : 10
	})
	resetButton.on('up', ultraReset)

	statusLight = new five.Led.RGB({
		pins : {
			red : 6
			, green : 5
			, blue : 3
		}
	})

	ultraSensor = new five.Ping(11)
	ultraSensor.on('change', ultraChange)
	ultraSensor.on('data', ultraData)

	magnetSensor = new five.Button({		

		isPullup : true
		, pin : 12
	})
	magnetSensor.on('up', function() {

		trigger('magnet')
	})

	photoSensor = new five.Sensor({

		pin : "A0"
		, freq : 250
	})
	photoSensor.on('data', photoData)

})

/**
 * Called when the sensor has detected a change in distance
 * from the last measurement. Activate alarm if we've already
 * initialized, and the change is greater than our threshhold.
 */
function ultraChange() {
	
	if(!init) { return }	
	var data = this.inches

	if(Math.abs(data - ultraBaseline) > ultraThreshold) {

		// if we haven't already triggered the alarm, do it!
		if(!ultraTriggered) { 

			trigger('ultrasonic') 
			return ultraTriggered = true
		}
	}
	ultraTriggered = false
}

/**
 * Called when the ultrasonic sensor reports data, which is done
 * on an interval. Fires even when no change was detected.
 */
function ultraData() {

	var inches = this.inches
	if(ultraReadings.length >= 10) { 

		ultraReadings.shift()
		if(!init) {

			ultraBaseline = ultraReadings.sort()[4]
			console.log("Calculated baseline: %s", ultraBaseline)
			armDisarm(true)
		}
		init = true
	}
	else {

		statusLight.color('#0000FF')
	}
	ultraReadings.push(inches)
}

/**
 * Reset the baseline measurement for the ultrasonic sensor
 * Called when the reset button is pressed
 */
 function ultraReset() {

 	console.log("* Resetting...")
	ultraReadings = [ ] 
 	init = false
}

/**
 * Called when the photovoltaic sensor reports data. Also done
 * on an interval. Fires even when no change was detected.
 */
function photoData() {

	var data = this.value
	if(Math.abs(data - photoReading) > photoThreshold) {

		if(!photoTriggered) { 
			
			trigger('laser') 
		}
		return photoTriggered = true
	}
	photoTriggered = false
	photoReading = data
}

/**
 * Called when the arm/disarm button is pressed.
 * Changes the color of the status LED, and prevents
 * SMS messages from being sent
 */
function armDisarm(override) {

	if(typeof override == 'boolean') { 

		isArmed = override 
	}
	else { isArmed = !isArmed }

	if(isArmed) {

 		console.log("* Arming")
		statusLight.color('#FF0000')
	}
	else {

		console.log("* Disarming")
		statusLight.color('#00FF00')
	}
}

/**
 * Called when a sensor has detected an event
 * Actually sends the SMS via Twilio, and logs
 * which sensor caused the trigger
 */
function trigger(sensor) {

	if(!isArmed) { return }
	var now = (new Date()).valueOf()

	console.log("* Alarm has been triggered (%s) [%s]"
		, sensor
		, trips
	)
	if(now - ratelimit < lastSMS) {

		return console.log("> Ratelimiting.")
	}
	
	++trips
	lastSMS = now
	client.messages.create({

		body : "Alarm has been triggered by " + sensor
		, to : "+1 415-374-9129"
		, from : "+1 415-599-2671"
	}, function smsResults(err, msg) {

		if(err) { 

			console.log("*** ERROR ***\n")
			return console.log(err) 
		}
		if(!msg.errorCode) {

			return console.log("> Success!")
		}
		console.log("> Problem: %s", msg.errorCode)
	})
	console.log("> Sending SMS.")
}