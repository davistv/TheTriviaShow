# TheTriviaShow
Web app for hosting  a multi-player trivia game, along with plans for a buzzer system using a Makey Makey.

To run without CORS issues, run in a mini web server:
php -S localhost:8012

The browser window captures all keyDown and keyUp events and handles them internally. The pins I used on the Makey Makey translate to keystrokes AWSDF for the contestant buzzers. The host of the game has a typical bluetooth presentation controller, it sends pageUp and pageDown keys.

Initial intent for game structure is to allow the host to change the number of questions to be asked, first question is shown, the host sees the question and answer on a seperate screen, will use the browser dev console for this initially. Contestant buzzers are captured in order, each player that buzzed in gets a chance to answer the question until the correct answer is given. The host presses the controller pageDown on incorrect answers and the next player is prompted to give an answer. The host presses the controller pageUp on correct answers, which awards a point to the player and shows the next question. Play continues for the number of questions specified, then if any players are tied for a win, playoff mode begins, each player answers one question until there's a point difference between the competitor. The player is congratulated on screen, and the host can start a new game.
