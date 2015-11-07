# React Premier league football table.
_Built with Gulp, Webpack and Mocha Chai. Updated via websockets._

## Premier League Football rules
 - There are 20 teams in the premier league, each starting with 0 points.
 - When a game is played points are awarded as follows, 3 for a win, 1 for a draw and 0 for a loss.
 - Teams are ordered via the following: points, goal difference, goals for and finally team name.

## Running the app
Run npm start from the command line to fire up a server, then navigate to http://localhost:8080

## Testing
Run npm test from the command line and watch the green (ignore silly DOM nesting warnings).

## TODO
 - Fix silly DOM nesting warnings
 - Add time scrubber to rewind state
 - Add request to fetch more premier league campaigns