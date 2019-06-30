// Configure these for your situation
var numQuestions = 10;  // how many questions to be asked during a round?
var contestantKeys = ['a', 'w', 's', 'd', 'f']; // each contestant uses a key, configure them here, 5 players assumed right now
var quickShowPause = 100; // several pause lengths
var mediumShowPause = 500;
var answerPause = 3000;
var endGamePause = 12000;

// You shouldn't have to configure anything below here
var questions;
var shuffledQuestions;
var audioStarted = 0;
var gameStarted = 0;
var questionsAsked = 0;
var contestantQueue = [];
var showingQuestion  = 0;
var questionsAskedThisGame = [];
var thisQuestion;

function loadQuestions() {
	$.ajax({
		type: "GET",
		url: "questions.csv",
		dataType: "text",
		success: function(response)  {
			questions = $.csv.toArrays(response);
			questions.shift(); // drop header line
		}
	}).done(function( data ) {
		if ( console && console.log ) {
			// console.log( "Sample of data:", questions.slice( 0, 100 ) );
		}
		shuffledQuestions = shuffle(questions);
		// console.log(questions);
	});
}

function key2color(key){
	switch (key) {
		case 'a':
			return('blue');
			break;
		case 'w':
			return('red');
			break;
		case 's':
			return('gold');
			break;
		case 'd':
			return('white');
			break;
		case 'f':
			return('green');
			break;
	}
}

function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function startup() {
	console.log("Get ready for Scout Trivia!");
	gameStarted = 1;
	$('.start').hide(mediumShowPause);
	startGame();
}

function startGame() {
	showQuestion();
}

function initAudio() {
	if(!audioStarted) {
		lowLag.init({'debug': 'none'});
		lowLag.load("sfx/start.mp3");
		lowLag.load("sfx/correct.mp3");
		lowLag.load("sfx/wrong.mp3");
		lowLag.load("sfx/winner.mp3");
		lowLag.load("sfx/punch.mp3");
		lowLag.load("sfx/goat.mp3");
		lowLag.load("sfx/toaster.mp3");
		lowLag.load("sfx/ringin.mp3");
		lowLag.load("sfx/lazer.mp3");
		audioStarted = 1;
	}
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

var randomSounds = new Array("sfx/punch.mp3", "sfx/goat.mp3", "sfx/toaster.mp3", "sfx/lazer.mp3",  "sfx/ringin.mp3");

function randSnd() {
	var rnd = randomIntFromInterval(0, randomSounds.length-1);
	return randomSounds[rnd];
}

function showQuestion() {
	$('.question').show(quickShowPause);
	showingQuestion = 1;
	contestantQueue = [];
	$('.player-order').hide(mediumShowPause);
	thisQuestion = shuffledQuestions.shift();
	var thisHtmlQuestion = thisQuestion[0].replace(/(?:\r\n|\r|\n)/g, '<br>');
	$('.question').html(thisHtmlQuestion);
	questionsAsked++;
	console.warn("Question: " + thisQuestion[0]);
	console.error("Answer: " + thisQuestion[1])
}

function showAnswer() {
	showingAnswer = 1;
}

function findWinner() {
	var scores = {
		'a': parseInt($('.player-score.a').html()),
		'w': parseInt($('.player-score.w').html()),
		's': parseInt($('.player-score.s').html()),
		'd': parseInt($('.player-score.d').html()),
		'f': parseInt($('.player-score.f').html())
	};
	
	var score_keys = new Array();
	var score_values = new Array();
	
	for (var key in scores) {
		score_keys.push(key);
		score_values.push(scores[key]);
	}
	
	var topScore = Math.max.apply(null, score_values);
	
	var numPlayersWithTopScore = 0;
	var winners = [];
	for (var key in scores) {
		if (scores[key] ==  topScore) {
			numPlayersWithTopScore++;
			winners.push(key);
		}
	}
	return winners;
}

function endGameCheck(thisContestant) {
	var winners = findWinner();
	if (winners.length == 1) {
		showingQuestion = 0;
		console.error(capitalize(key2color(thisContestant)) + " Player Wins!");
		$('.answer').html("");
		$('.question').html("Congratulations " + capitalize(key2color(thisContestant)) + " Player!");
		lowLag.play("sfx/winner.mp3");
		gameStarted = 0;
		setTimeout(function(){
			$('.question').hide(quickShowPause);
			$('.start').show(mediumShowPause);
			$('.player-order').hide(quickShowPause);
			$('.player-order').html("");
			$('.player-score').html("0");
			console.clear();
		}, endGamePause);
	} else {
		// tie breaker
		console.warn("Tie breaker!");
		showingQuestion = 0;
		setTimeout(function(){
			$('.answer').html("");
			showQuestion();
		}, answerPause);
	}
}

function handleKey(key) {
	if (!gameStarted) { //  game isn't started yet
		if (key == 'PageUp') {
			loadQuestions();
			startup();
			lowLag.play("sfx/start.mp3");
		} else if (key == 'PageDown') {
			lowLag.play("sfx/wrong.mp3");
		} else {
			// wait for host to start the game
			lowLag.play(randSnd());
		}
	} else { // game in play)
		if (contestantKeys.includes(key)) {
			// contestant hit their button
			if (!contestantQueue.includes(key)) { // ignore extra hits from contestants
				contestantQueue.push(key);
				switch (contestantQueue.length) { // first contestant hit their button after question start
					case 1:
						$('.player-order.' + key).html('1st').show(quickShowPause);
						console.log("1st: Player " + capitalize(key2color(key)));
						break;
					case 2:
						$('.player-order.' + key).html('2nd').show(quickShowPause);
						console.log("2nd: Player " + capitalize(key2color(key)));
						break;
					case 3:
						$('.player-order.' + key).html('3rd').show(quickShowPause);
						console.log("3rd: Player " + capitalize(key2color(key)));
						break;
					case 4:
						$('.player-order.' + key).html('4th').show(quickShowPause);
						console.log("4th: Player " + capitalize(key2color(key)));
						break;
					case 5:
						$('.player-order.' + key).html('5th').show(quickShowPause);
						console.log("5th: Player " + capitalize(key2color(key)));
						break;
				}
				lowLag.play(randSnd());
			}
		} else {
			thisContestant = contestantQueue.shift();
			if (key == 'PageUp') {
				lowLag.play("sfx/correct.mp3");
				console.info('Correct answer from ' + key2color(thisContestant));
				var oldScore = $('.player-score.' + thisContestant).html();
				var newScore = parseInt(oldScore) + 1;
				$('.player-score.' + thisContestant).html(newScore);
				$('.player-order.' + thisContestant).html("<span class='correct-answer-check'>√</span>");
				$('.answer').html(thisQuestion[1]).show(quickShowPause);
				
				// end game if we have a winner, tie breaker if not
				if (questionsAsked >= numQuestions) {
					endGameCheck(thisContestant);
				} else { // show the next question
					showingQuestion = 0;
					setTimeout(function(){
						$('.answer').html("");
						showQuestion();
					}, answerPause);
				}
			} else if (key == 'PageDown') { // wrong answer
				console.error('Wrong anser from ' + key2color(thisContestant));
				$('.player-order.' + thisContestant).html('<span class="wrong-answer-x">X</span>');
				lowLag.play("sfx/wrong.mp3");
				//  Advance to the next question if nobody left in the queue
				if (contestantQueue.length == 0) {
					if (questionsAsked >= numQuestions) {
						endGameCheck(thisContestant);
					} else {
						showingQuestion = 0;
						$('.answer').html(thisQuestion[1]);
						$('.answer').show(answerPause);
						setTimeout(function(){
							$('.answer').hide(quickShowPause);
							showQuestion();
						}, answerPause);
					}
				}
			}
		}
	}
}

$(document).ready(function() {
	loadQuestions();
	$(document).keydown(function(event) {
		if (!audioStarted) {
			initAudio();
			audioStarted =  1;
		}
		handleKey(event.key);
	}).keyup(function(event) {
		event.preventDefault();
	});
	
	$(".start button").click(function(){
		if (!audioStarted) {
			initAudio();
			audioStarted = 1;
		}
		startup();
	});
});