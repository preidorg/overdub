/* global URL, playBack */

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 						//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var playButton = document.getElementById("playButton");

var params = new URLSearchParams(location.search);
var playbackURL = params.get('playback');

if(params.get('playback')===null){
    console.log("Backing track URL not found: ", playbackURL);
    document.getElementById("mainInterface").style.display = 'none';  // Hide controls
    askForPlaybackURL();
}
else {
    console.log("Backing track URL found: ", playbackURL);
    document.getElementById("inputPlaybackURL").style.display = 'none';  // Hide URL input box
    var playbackFileNameSansExtension = playbackURL.replace(/^.*[\\\/]|\.[^/.]+$/g, '');
    var playback = new Audio(playbackURL);
    document.getElementById("displayPlaybackURL").innerHTML= playbackURL.replace(/^.*[\\\/]/, '');
    document.getElementById("displayPlaybackURL").href= playbackURL;
}


document.getElementById("JSwarning").style.display = 'none';  // Hide javascript warning
document.getElementById("overdubURLdisplay").style.display = 'none';  // Hide User URL display
document.getElementById("encodingTypeSelectDiv").style.display = 'none';  // Hide encoding options

function askForPlaybackURL(){
    console.log("ask for URL");
    document.getElementById("overdubURL").style.display = 'block';  // Reveal URL input box and accompanying instructions
}

function getUserPlaybackURL(){
    console.log("get URL");
    document.getElementById("overdubURLdisplay").style.display = 'block';  // Reveal URL
    var userPlaybackURL = document.getElementById('userPlaybackURL').value;
    document.getElementById("overdubURL").innerHTML= window.location.href + "?playback=" + userPlaybackURL;
    document.getElementById("overdubURL").href= window.location.href + "?playback=" + userPlaybackURL;
     
     window.location.href
//   innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz";
}


//add events to those 3 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", startPlayback);

function startPlayback() {
	console.log("startPlayback() called - ", playbackURL);
        // temporarily change the function of the stop button from stopRecording to stop Playback.  We'll remember to change it back!
        stopButton.removeEventListener("click", stopRecording);
        stopButton.addEventListener("click", stopPlayback);

        playback.play();   
        
	recordButton.disabled = true;
	playButton.disabled = true;
        stopButton.disabled = false;
    }
    
function stopPlayback() {
	console.log("stopPlayback() called");
        
        playback.pause(); 
        playback.currentTime = 0;  
        // This is where we change the function of the stop button back to stopRecording from stopPlayback!
        stopButton.removeEventListener("click", stopPlayback);
        stopButton.addEventListener("click", stopRecording);

        // Put the button states back to what they should be
        recordButton.disabled = false;
	playButton.disabled = false;
        stopButton.disabled = true;
}

function startRecording() {
	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, 
        echoCancellation: false, 
        video:false };

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz";

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		
		//disable the encoding selector
		encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    __log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    __log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			__log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			encodingTypeSelect.disabled = false;
		};

		recorder.setOptions({
		  timeLimit:playback.duration,  // was 120seconds or something like that
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 128}
	    });

		//start the recording process
		recorder.startRecording();

		 __log("Recording started");
                 
                playback.play();   
//		 __log("Playback started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	//disable the record button
	recordButton.disabled = true;
	playButton.disabled = true;
        stopButton.disabled = false;
}

function stopRecording() {
	console.log("stopRecording() called");
        stopPlayback();
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	stopButton.disabled = true;
	recordButton.disabled = false;
	playButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();
	__log('Recording stopped - please wait...');
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = playbackFileNameSansExtension + '_' + new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	li.appendChild(link);

	//add the li element to the ordered list
	recordingsList.appendChild(li);
}



//helper function
function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}