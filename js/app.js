/* global URL, playBack */

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

checkLanguage();
document.getElementById("JSwarning").style.display = 'none';

var gumStream; 			//stream from getUserMedia()
var recorder; 			//WebAudioRecorder object
var input; 			//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 		//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;   // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

// Configure UI elements
var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var playButton = document.getElementById("playButton");

//add events to those 3 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", startPlayback);

// get the URL for the backing track...
var params = new URLSearchParams(location.search);
var playbackURL = checkURL(params.get('playback')||params.get('pb'));
var playback = new Audio(playbackURL);
var pbTitle = checkpbTitle(params.get('pbtitle'));
console.log("pbtitle: ", pbTitle);
// ... and help the user configure ovrdub if there isn't a backing track URL

if (playbackURL === null) {          // If no backing track found in the URL...
    console.log("Backing track URL not found.");
    document.getElementById(
            "mainInterface").style.display = 'none';  // Hide controls
    askForPlaybackURL();    // Run the code to help the user ask for a URL
} else {
    console.log("Valid backing track URL found: ", playbackURL);
    document.getElementById(
            "inputPlaybackURL").style.display = 'none';  // Hide URL input interface
    var playbackFileNameSansExtension = playbackURL.replace(
            /^.*[\\\/]|\.[^/.]+$/g, '');
    var playback = new Audio(playbackURL);
    document.getElementById(
            "displayPlaybackURL").innerHTML = (pbTitle||playbackURL.replace(
            /^.*[\\\/]/, ''));
    document.getElementById("displayPlaybackURL").href = playbackURL;
}


function checkLanguage(){
    var known = { en: true, fr: true};
    var lang  = ((navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || 'en').substr(0, 2);
    if(!known[lang])
        lang = 'en';
    console.log("Language: ", lang);

    document.getElementById("langstyle").href="style_" + lang + ".css";
}


function toggle_show_help() {
    switch (document.getElementById("od_help").style.display) {
        case "block":
            document.getElementById("od_help").style.display = 'none';
            break
        case "none":
            document.getElementById("od_help").style.display = 'block';
            break         
    }
}

function askForPlaybackURL(){
    console.log("ask for URL");
    document.getElementById("inputPlaybackURL").style.display = 'block';  // Reveal URL input box and accompanying instructions
    document.getElementById("overdubURL").style.display = 'block';  // Reveal URL input box and accompanying instructions
}

function getUserPlaybackURL(){
    console.log("get user backing track URL");
    // Reveal the code to display the generated URL and explain what to do with it.
    document.getElementById("overdubURLdisplay").style.display = 'block'; 
    // Grab and check the user enterred URL
    var userPlaybackURL = checkURL(document.getElementById('userPlaybackURL').value);
    var userPbTitle = checkpbTitle(document.getElementById('userPbTitle').value);
    var baseURL = window.location.href.split('?')[0];
    if(userPlaybackURL) {
        var ovrdubURL= (baseURL + "?pb=" + userPlaybackURL);
        if (userPbTitle){
            ovrdubURL= (ovrdubURL + "&pbtitle=" + userPbTitle);
        }
        document.getElementById("overdubURL").innerHTML= ovrdubURL;
        document.getElementById("overdubURL").href= ovrdubURL;
    }
    else {
        document.getElementById("overdubURL").innerHTML= "Invalid URL / URL non valide";
        document.getElementById("overdubURL").href= "";
        
    }
     
//     window.location.href
//   innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz";
}

//function getUserPlaybackURL(){
//    console.log("get URL");
//    document.getElementById("overdubURLdisplay").style.display = 'block';  // Reveal URL input interface
//    var userPlaybackURL = document.getElementById('userPlaybackURL').value;
//    document.getElementById("overdubURL").innerHTML= window.location.href + "?playback=" + userPlaybackURL;
//    document.getElementById("overdubURL").href= window.location.href + "?playback=" + userPlaybackURL;
//     
// //     window.location.href
// //   innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz";
//}

function checkURL(playbackURL) {
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    var regexp = new RegExp(expression);

    if (playbackURL) {
        matchURL = playbackURL.match(regexp);
        if (matchURL) {
            return matchURL[0];
        }
    }
    return null;
}

function checkpbTitle(pbTitle) {
    var expression = /[-a-zA-Z0-9_\+.]+/;
    var regexp = new RegExp(expression);

    if (pbTitle) {
        matchText = pbTitle.match(regexp);
        if (matchText) {
//            console.log("pbtitle found:", matchText[0]);
            return matchText[0];
        }
    }
    return null;
}

function startPlayback() {
	console.log("startPlayback() called - ", playbackURL);
        // temporarily change the function of the stop button from stopRecording to stop Playback (redundant if playig twice in a row of course).  We'll change it back when we're finished.
        stopButton.removeEventListener("click", stopRecording);
        stopButton.addEventListener("click", stopPlayback);

        playback.play();   
        
        // Put the button states back to what they should be
	recordButton.disabled = true;
	playButton.disabled = true;
        stopButton.disabled = false;
    }
    
function stopPlayback() {
	console.log("stopPlayback() called");
        
        playback.pause(); 
        playback.currentTime = 0;  
        // This is where we change the function of the stop button back to stopRecording from stopPlayback (redundant if recording twice in a row of course).
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
            __logClear();
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

	//disable the stop button and enable the other buttons
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
        var usersName = document.getElementById('usersName').value;
                if (usersName !==''){
            usersName += '_';
        }
        let usersClass = document.getElementById('usersClass').value;
        if (usersClass !==''){
            usersClass += '_';
        }
	link.download = (pbTitle||playbackFileNameSansExtension) + '_' + usersClass + usersName + new Date().toISOString() + '.'+encoding;
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
function __logClear() {
    log.innerHTML = '';
}