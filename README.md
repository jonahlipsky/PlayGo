# job_search_js_project

# Project Title: PlayGo!

## Live Link!
[PlayGo! Live](https://playgo.jonahlipsky.io "PlayGo! Live")

## Background and Overview
  * Motivation for project: One of the ancient strategy games of the world, Go has engrossed humans for millenia. PlayGo! will provide an easy-to-use interface for playing Go against a friend or a stranger. 
  * High level overview: The game Go uses relatively simple rules and a grid board which, together, create more than 10^170  [legal board positions](https://tromp.github.io/go/legal.html). It's an ancient strategy game with incredible layers of complexity. The object of the game is to capture territory, represented as crosses on a grid, traditionally of size 19x19, though 9x9 and 13x13 are common for beginner games. Important strategic considerations include protecting your own territory and stones, while threatening and capturing the opponent's stones and territory. The game ends when both players agree that there are no reasonable moves left, or in other words, neither player believes that they can improve their position further.

![Go Game in Progress](https://github.com/jonahlipsky/job_search_js_project/blob/master/src/images/go-game-with-moves-and-chat.png)

## Key Features
  * Game board and rule set: Game board renders a 19x19 grid and the game rules allow for game pieces to be captured and illegal moves to be refused.
  * Two sided turn based game
    * Users will be able to make moves and their moves will be represented on the other computer in real time.
    * Game states are saved and can be returned to at a later date.
  * Chat room feature
    * Users can send chat messages back and forth in real time in the game. 
    * Non-player spectators can also send chat messages.
    
* Architecture and Technologies
  * Google Firebase
    * Firebase is a NoSQL server that runs in Google's cloud services. It integrates with Node.js allowing it to host the App. 
    * In order to create an interactive two player game, and also to create the ability to chat in real time, Google Firebase employs easy-to-use event listeners which will send snapshots to open session of the App upon a change to the databse.
  * Javascript for basic game implementation and logic
  * HTML Canvas for rendering of pieces and the game board
  * Webpack for bundling multiple javascript files
  
## Future directions: 
  * Short term: connect to external API to handle game scoring and an AI computer player.
  * Medium term: write my own game scoring script in javascript.
  * Long term: write my own AI that utilizes Deep Learning and Neural Networks to learn the game of Go, following the example of Google's Deep Mind team.
  * Improve rendering of game board to be more visually appealing.
