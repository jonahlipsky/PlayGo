# job_search_js_project

* Project Title: PlayGo!
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
    * Feature 3: Two-sided turn based game
      * Users who come to the website can enter their name. Once two individuals have 'logged in', the game begins.
      * Users will be able to make moves and their moves will be represented on the other computer in real time.
    * Feature 4: "Pass" button and automatic Scoring
      * Implement a 'pass turn' button. The game ends when both players press the 'pass turn' button on their turn.
      * Using a rule set, automatically tabulate the final score.
         * Captured territory is scored for the player who surrounds those crosses.
         * Captured stones subtracted from their owners final score. 
         * Stones contained within another persons territory, if they do not contain an 'eye', are considered taken. 
* Architecture and Technologies
    * Technology 1
        * Description
        * Justification
    * Technology 2
        * Description
        * Justification
    ...
Implementation Timeline
    * Most important category
    * Daily breakdown
    * Aim to be done by Friday
    
    
