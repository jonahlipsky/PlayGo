# job_search_js_project

# Project Title: PlayGo!
* Background and Overview
    * Motivation for project: One of the ancient strategy games of the world, Go has engrossed humans for millenia. PlayGo! will provide an easy-to-use interface for playing Go against a friend or a stranger. 
    * High level overview: The game Go uses relatively simple rules and a grid board which, together, create more than 10^170  [legal board positions](https://tromp.github.io/go/legal.html). It's an ancient strategy game with incredible layers of complexity. The object of the game is to capture territory, represented as crosses on a grid, traditionally of size 9x9, 13x13, or 19x19. Important strategic considerations include protecting your own territory and stones, while threatening and capturing the opponent's stones and territory. The game ends when both players agree that there are no reasonable moves left, or in other words, neither player believes that they can improve their position further.
    
* Functionality and MVP Features
    * Feature 1: Game board and rule set
      * The full implementation of the game rules allow for game pieces to be captured and illegal moves to be refused with an error message. 
      * Illegal moves prevented, including playing in a position that would result in being immediately taken and repeating a board position less than 1 full turn (both players playing) after it was previously seen.
      * Game board input allowing for 9x9, 13x13 and 19x19 boards.
    * Feature 2: One-sided turn based clickable game interacting with the game board. 
      * Users on the same computer can play a game of Go by clicking on the game board at a certain position.
      * Stone will automatically be assigned to black or white depending on the turn
    * Feature 3: "Pass" button and automatic Scoring
      * Implement a 'pass turn' button. The game ends when both players press the 'pass turn' button on their turn.
      * Using a rule set, automatically tabulate the final score.
         * Captured territory is scored for the player who surrounds those crosses.
         * Captured stones subtracted from their owners final score. 
         * Stones contained within another persons territory, if they do not contain an 'eye', are considered taken. 
         * Rules for acknowledgeing 'seki' or 'mutual life' where neither person can be said to be encircling the others stones in a certain board position.
     * Feature 4: Two-sided turn based game
       * Users who come to the website can enter their name. Once two individuals have 'logged in', the game begins.
       * Users will be able to make moves and their moves will be represented on the other computer in real time.
       * The first user to the site chooses whether the game is 9x9, 13x13 or 19x19. 
       * When two players have logged in, and player one has selected the game board, the game begins. If more than two players log in, the first two to arrive are the ones who play the game.
     * Feature 5: Chat Room feature
       * Everyone who logs into the site are represented as a username in a user list
       * Everyone, both players and spectators, can comment and have their posts publicly seen by all in attendance
* Architecture and Technologies
    * Socket.io
        * Socket.io is a library that enables real-time two-way interaction that runs on Node.js. It contains the basis for a server and client implementations that expose APIs that can be used like websockets. It's underlying technology is indeed websockets.
        * This will allow two players on separate computers, or on separate sessions on the same computer, to play against each other. It will allow multiple players and spectators to chat with each other. It also allows the possibility for multiple channels, so this could eventually be used to allow for multiple games being played simultaneously.
    * Google Firebase: Firestore
        * Firestore is a NoSQL server that runs in Google's cloud services. It integrates with Node.js, allowing it to be used to hose the Socket.io server.
        * In order to create an interactive two player game, and also to create the ability to chat in real time, a server needs to be employed for websocket functionality. Google Firestore allows a free option which allows more than enough bandwidth, storage, and download capability for the light-weight footprint of this game. 

## Implementation Timeline
   * By end of Wednesday, February 6th: 
      * Complete game board and rule set. 
      * Basic visualization of a grid complete.
      * Partially completed implementation of feature 2, click based gameplay. 
    * By end of Thursday, February 7th:
      * Complete click based gameplay feature
      * Complete "Pass turn" button and automatic scoring

      
