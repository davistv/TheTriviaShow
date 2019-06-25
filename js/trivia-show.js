var questions = {};
questions['How many?'] = "5";
questions['How much?'] = "3";
questions['Goerge?'] = 'Vader';

var audioStarted = 0;
var gameStarted = 0;
var scores = [0,0,0,0,0];
var numQuestions = 2;
var questionsAsked = 0;

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function startup() {
	console.log("Get ready for Scout Trivia!");
	gameStarted = 1;
	startGame();
}

function startGame() {
	while (questionsAsked < numQuestions) {
		var thisQuestion = randomIntFromInterval(0, questions.length - 1);
		$('.question').html(questions[thisQuestion]);
		questionsAsked++;
	}
}

function initAudio() {
	if(!audioStarted) {
		lowLag.init();
		lowLag.load("sfx/punch.mp3");
		lowLag.load("sfx/correct.mp3");
		lowLag.load("sfx/wrong.mp3");
		audioStarted = 1;
	}
}

function handleKey(key) {
	if (!gameStarted) {
		if (key == 'PageUp') {
			startup();
			lowLag.play("sfx/correct.mp3");
		} else {
			// wait for host to start the game
			lowLag.play("sfx/punch.mp3");
		}
	} else {
		// gameplay
		lowLag.play("sfx/punch.mp3");
		console.log('gameplay: ' + key);
	}
}

$(document).ready(function() {
	$(document).keydown(function(event) {
		if (!audioStarted) {
			initAudio();
		}
		handleKey(event.key);
		console.log(event.key);
	}).keyup(function(event) {
		event.preventDefault();
	});
	
	$(".start button").click(function(){
		if (!audioStarted) {
			initAudio();
		}
		startup();
	});
});