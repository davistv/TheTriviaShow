var questions = [];
questions.push(["What is the standard tie-in knot used by most rock climbers? <br>\n <br>\n A. Square Knot <br>\n B. Double Figure 8 <br>\n C. Bowline <br>\n D. Clove Hitch", "Double Figure 8"]);
questions.push(['True or False: If a fire ring does not exist, your best option is to make one using rocks in the area.', "False (leave no trace!)"]);
questions.push(['True or False: Food, cookware and fuel should be stored in the same area of your backpack.', 'False (the fuel can leak)']);
questions.push(['In what season do most cases of Hypothermia happen?', 'Spring']);
questions.push(["When cycling on the road, you should: <br>\n<br>\n A. Ride against traffic <br>\n B. Ride with traffic <br>\n C. Ride on the sidewalk <br>\n D. Ride in the middle of the road", 'B. Ride with traffic']);

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

var shuffledQuestions = shuffle(questions);

var audioStarted = 0;
var gameStarted = 0;
var numQuestions = 5;
var questionsAsked = 0;
var answerPause = 3000;
var endGamePause = 12000;
var contestantKeys = ['a', 'w', 's', 'd', 'f'];
var contestantQueue = [];
var contestantsTurn = 0;
var showingQuestion  = 0;
var questionsAskedThisGame = [];
var thisQuestion;

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function startup() {
	console.log("Get ready for Scout Trivia!");
	gameStarted = 1;
	$('.start').hide(500);
	startGame();
}

function startGame() {
	thisQuestion = shuffledQuestions.shift();
	$('.question').html(thisQuestion[0]);
	console.log("Q: " + thisQuestion[0]);
	console.log("A: " + thisQuestion[1]);
	questionsAsked++;
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
	showingQuestion = 1;
	thisQuestion = shuffledQuestions.shift();
	$('.question').html(thisQuestion[0]);
	questionsAsked++;
	console.log("Question: " + thisQuestion[0]);
	console.log("Answer: " + thisQuestion[1])
}

function showAnswer() {
	showingAnswer = 1;
	console.log("show answer");
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
	
	var winners = Math.max.apply(null, score_values);
	
	
	console.log('max scores:');
	console.log(winners);
}

function handleKey(key) {
	if (!gameStarted) { //  game isn't started yet
		if (key == 'PageUp') {
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
						$('.player-order.' + key).html('1st').show();
						console.log("1st: Player " + capitalize(key2color(key)));
						break;
					case 2:
						$('.player-order.' + key).html('2nd').show();
						console.log("2nd: Player " + capitalize(key2color(key)));
						break;
					case 3:
						$('.player-order.' + key).html('3rd').show();
						console.log("3rd: Player " + capitalize(key2color(key)));
						break;
					case 4:
						$('.player-order.' + key).html('4th').show();
						console.log("4th: Player " + capitalize(key2color(key)));
						break;
					case 5:
						$('.player-order.' + key).html('5th').show();
						console.log("5th: Player " + capitalize(key2color(key)));
						break;
				}
				lowLag.play(randSnd());
			}
		} else {
			thisContestant = contestantQueue.shift();
			if (key == 'PageUp') {
				lowLag.play("sfx/correct.mp3");
				console.log('Correct answer from ' + key2color(thisContestant));
				var oldScore = $('.player-score.' + thisContestant).html();
				var newScore = parseInt(oldScore) + 1;
				$('.player-score.' + thisContestant).html(newScore);
				$('.player-order').hide(500);
				$('.answer').html(thisQuestion[1]);
				
				// end game if we have a winner
				if (questionsAsked == numQuestions) {
					var winner = findWinner();
					lowLag.play("sfx/winner.mp3");
					setTimeout(function(){
						$('.answer').html("");
						$('.question').html("Congratulations " + capitalize(key2color(thisContestant)) + " Player!")
					}, endGamePause);
				}
				else {
					setTimeout(function(){
						$('.answer').html("");
						showQuestion();
					}, answerPause);
				}
			} else if (key == 'PageDown') {
				console.log('Wrong anser from ' + key2color(thisContestant));
				$('.player-order.' + thisContestant).html('X');
				lowLag.play("sfx/wrong.mp3");
			}
		}
	}
}

$(document).ready(function() {
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