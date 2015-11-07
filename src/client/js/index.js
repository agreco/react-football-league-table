
var ReactDOM = require('react-dom'),
    FootballLeagueTable = require(__dirname + '/components/FootballLeagueTable.js');

ReactDOM.render(<FootballLeagueTable url="/teams" />, document.body);
