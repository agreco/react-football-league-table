
var React = require('react'),
    $ = require('jquery'),
    LeagueTable = require(__dirname + '/LeagueTable.js'),
    FootballLeagueTable = React.createClass({ displayName: 'FootballLeagueTable',
        sortTableByName: function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        },

        sortTableByGoalDifference: function (a, b) {
            if (a.goalDifference < b.goalDifference) return -1;
            if (a.goalDifference > b.goalDifference) return 1;
            return 0;
        },

        sortTableBy: function (key) {
            return function (a, b) {
                if (a[key] < b[key]) return 1;
                if (a[key] > b[key]) return -1;
                return 0;
            };
        },

        addTeamAttr: function (data) {
            if (data && data.length) {
                data.forEach(function (team) {
                    team.position = 0;
                    team.played = 0;
                    team.won = 0;
                    team.drawn = 0;
                    team.loss = 0;
                    team.goalsFor = 0;
                    team.goalsAgainst = 0;
                    team.goalDifference = 0;
                    team.points = 0;
                });
                return data;
            }
        },

        calculateGameResult: function (data) { // TODO: CHANGE DIRECT MUTATION OF STATE to use setState!!!!
            this.state.teams.forEach(function (team) {
                var homeGoals = parseInt(data.homeGoals, 10), awayGoals = parseInt(data.awayGoals, 10);

                if (team.id === data.homeTeamId) {
                    team.played += 1;
                    team.goalsFor += homeGoals;
                    team.goalsAgainst += awayGoals;
                    team.goalDifference = team.goalsFor - team.goalsAgainst;
                    if (homeGoals === awayGoals) {
                        team.drawn += 1;
                        team.points += 1;
                    } else if (homeGoals > awayGoals) {
                        team.won += 1;
                        team.points += 3;
                    } else {
                        team.loss += 1;
                    }
                }
                if (team.id === data.awayTeamId) {
                    team.played += 1;
                    team.goalsFor += awayGoals;
                    team.goalsAgainst += homeGoals;
                    team.goalDifference = team.goalsFor - team.goalsAgainst;
                    if (homeGoals === awayGoals) {
                        team.drawn += 1;
                        team.points += 1;
                    } else if (awayGoals > homeGoals) {
                        team.won += 1;
                        team.points += 3;
                    } else {
                        team.loss += 1;
                    }
                }
            });
            return this.state.teams;
        },

        sortTable: function (data) {
            this.setState({
                teams: this.calculateGameResult(JSON.parse(data))
                    .sort(this.sortTableBy('goalsFor'))
                    .sort(this.sortTableByGoalDifference)
                    .sort(this.sortTableBy('points'))
            });
        },

        connectToSocket: function () {
            var games = io.connect('http://localhost:8080/games');
                games.on('gameplayed', function (data) {
                    this.sortTable(data);
                }.bind(this)).on('disconnect', function () {
                    this.setState({ teams: this.addTeamAttr(this.state.teams).sort(this.sortTableByName) });
                }.bind(this));
        },

        getInitialState: function () {
            return { teams: [] };
        },

        fetchTeams: function () {
            return $.ajax({
                url: this.props.url,
                dataType: 'json',
                cache: true
            }).success(function (data) {
                this.setState({ teams: this.addTeamAttr(data).sort(this.sortTableByName) });
                if (window.io) this.connectToSocket();
            }.bind(this)).error(function (xhr, status, err) {
                debugger;
                console.error(this.props.url, xhr.responseText, xhr.statusText, xhr.status);
            }.bind(this));
        },

        componentDidMount: function () {
            this.fetchTeams();
        },

        render: function () {
            return (<div><LeagueTable teams={this.state.teams} /></div>);
        }
});

module.exports = FootballLeagueTable;
