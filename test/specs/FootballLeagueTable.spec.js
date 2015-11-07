
var path = require('path'),
    chai = require('chai'),
    expect = chai.expect,
    nock = require('nock'),
    componentPath = path.join(process.cwd(), 'src/client/js/components/');

describe('FootballLeagueTable', function () {
    var React = require('react'),
        ReactDOM = require('react-dom'),
        $ = require('jquery'),
        ReactTestUtils = require('react-addons-test-utils'),
        FootballLeagueTable = require(path.join(componentPath, 'FootballLeagueTable.js'));

    beforeEach(function () {
        nock.cleanAll();
    });

    it('renders', function () {
        var host = 'http://localhost:9000', path = '/teams',
            footballLeagueTable = ReactTestUtils.renderIntoDocument(<FootballLeagueTable url={host+path} />);
        expect(ReactTestUtils.isCompositeComponent(footballLeagueTable)).to.be.ok;
    });

    it('renders table headers', function () {
        var host = 'http://localhost:9000', path = '/teams',
            footballLeagueTable = ReactTestUtils.renderIntoDocument(<FootballLeagueTable url={host+path} />),
            tableRows = ReactTestUtils.scryRenderedDOMComponentsWithTag(footballLeagueTable, 'tr'),
            tableHeaders = ReactTestUtils.scryRenderedDOMComponentsWithTag(footballLeagueTable, 'th'),
            tableCells = ReactTestUtils.scryRenderedDOMComponentsWithTag(footballLeagueTable, 'td'),
            headers = ['Position', 'Team', 'P', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts' ];

        expect(ReactTestUtils.isCompositeComponent(footballLeagueTable)).to.be.true;
        expect(tableRows.length).to.equal(1);
        expect(tableHeaders.length).to.equal(10);
        expect(tableCells.length).to.equal(0);
        headers.forEach(function (header, idx) {
            expect(tableHeaders[idx].textContent).to.equal(header);
        });
    });

    it('should build and order the layout based on team name', function (done) { // TODO: sort by team name
        var host = 'http://localhost:9000', path = '/teams',
            teams = [
                { 'id': 8, 'name': 'Arsenal'},
                { 'id': 9, 'name': 'QPR' },
                { 'id': 10, 'name': 'Bolton' },
                { 'id': 11, 'name': 'Wigan' },
                { 'id': 12, 'name': 'Norwich' }
            ],

            footballLeagueTable = ReactTestUtils.renderIntoDocument(<FootballLeagueTable url={host+path} />),
            tableBody, tableRows, sortedTeamNames;

        nock(host).get(path).reply(200, teams);

        footballLeagueTable.fetchTeams().done(function (data) {

            tableBody = ReactTestUtils.findRenderedDOMComponentWithTag(footballLeagueTable, 'tbody');
            tableRows = $('tr', tableBody);

            expect(tableRows.length).to.equal(5);

            [
                { 'id': 8, 'name': 'Arsenal'},
                { 'id': 9, 'name': 'Bolton' },
                { 'id': 10, 'name': 'Norwich' },
                { 'id': 11, 'name': 'QPR' },
                { 'id': 12, 'name': 'Wigan' }
            ].forEach(function (team, idx) {
                var rowCell, position = idx + 1;

                expect(footballLeagueTable.state.teams[idx].position).to.equal(position);
                rowCell = $('.position', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(position));

                rowCell = $('.team', tableRows[idx]);
                expect(rowCell.text()).to.equal(team.name);

                rowCell = $('.played', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.won', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.drawn', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.loss', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.goalsFor', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.goalsAgainst', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.goalsDifference', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));

                rowCell = $('.points', tableRows[idx]);
                expect(rowCell.text()).to.equal(String(0));
            });
            done();
        });
    });

    it('should update and order the layout', function (done) {
        function replaceState (data) {
            footballLeagueTable.setState({
                teams: footballLeagueTable.calculateGameResult(data)
                        .sort(footballLeagueTable.sortTableBy('goalsFor'))
                        .sort(footballLeagueTable.sortTableByGoalDifference)
                        .sort(footballLeagueTable.sortTableBy('points'))
            });
        }

        function testTeamCells (team, idx) {
            var rowCell, position = idx + 1;

            expect(footballLeagueTable.state.teams[idx].position).to.equal(position);

            rowCell = $('.position', tableRows[idx]);
            expect(rowCell.text()).to.equal(String(position));

            rowCell = $('.team', tableRows[idx]);
            expect(rowCell.text()).to.equal(team.name);

            rowCell = $('.goalsFor', tableRows[idx]);
            expect(rowCell.text()).to.equal(team.goals_for);

            rowCell = $('.goalsDifference', tableRows[idx]);
            expect(rowCell.text()).to.equal(team.goal_diff);

            rowCell = $('.points', tableRows[idx]);
            expect(rowCell.text()).to.equal(team.points);
        }

        var host = 'http://localhost:9000', path = '/teams',
            teams = [
                { 'id': 8,  'name': 'Arsenal', 'goals_for': '4', 'goal_diff': '0',  'points': '0' },
                { 'id': 9,  'name': 'QPR',     'goals_for': '0', 'goal_diff': '0',  'points': '0' },
                { 'id': 10, 'name': 'Bolton',  'goals_for': '0', 'goal_diff': '0',  'points': '0' },
                { 'id': 11, 'name': 'Wigan',   'goals_for': '0', 'goal_diff': '0',  'points': '0' },
                { 'id': 12, 'name': 'Norwich', 'goals_for': '0', 'goal_diff': '0',  'points': '0' }
            ];

        var footballLeagueTable = ReactTestUtils.renderIntoDocument(<FootballLeagueTable url={host+path} />),
            tableBody = ReactTestUtils.findRenderedDOMComponentWithTag(footballLeagueTable, 'tbody'),
            tableRows;

        nock(host).get(path).reply(200, teams);

        footballLeagueTable.fetchTeams().done(function (data) {

            // Ideally we want to be testing the connection to socket.io, and mocking the responses
            // But Jest seems to be not playing nicely, so we brute force the testing at this stage
            replaceState({ 'homeTeamId': 9, 'awayTeamId': 10, 'homeGoals': '0', 'awayGoals': '4' });
            tableRows = $('tr', tableBody);
            [
                { 'id': 10, 'name': 'Bolton',  'goals_for': '4', 'goal_diff': '4',  'points': '3' },
                { 'id': 9,  'name': 'QPR',     'goals_for': '0', 'goal_diff': '-4', 'points': '0' },
                { 'id': 8,  'name': 'Arsenal', 'goals_for': '0', 'goal_diff': '0',  'points': '0' },
                { 'id': 12, 'name': 'Norwich', 'goals_for': '0', 'goal_diff': '0',  'points': '0' },
                { 'id': 11, 'name': 'Wigan',   'goals_for': '0', 'goal_diff':'0',   'points': '0' }
            ].forEach(testTeamCells);

            replaceState({ 'homeTeamId': 11, 'awayTeamId': 12, 'homeGoals': '1', 'awayGoals': '1' });
            tableRows = $('tr', tableBody);
            [
                { 'id': 10, 'name': 'Bolton',  'goals_for': '4', 'goal_diff': '4', 'points': '3' },
                { 'id': 12, 'name': 'Norwich', 'goals_for': '1', 'goal_diff': '0', 'points': '1' },
                { 'id': 11, 'name': 'Wigan',   'goals_for': '1', 'goal_diff': '0', 'points': '1' },
                { 'id': 9,  'name': 'QPR',     'goals_for': '0', 'goal_diff': '-4', 'points': '0' },
                { 'id': 8,  'name': 'Arsenal', 'goals_for': '0', 'goal_diff': '0', 'points': '0' }
            ].forEach(testTeamCells);

            replaceState({ 'homeTeamId': 8, 'awayTeamId': 10, 'homeGoals': '3', 'awayGoals': '0' });
            tableRows = $('tr', tableBody);
            [
                { 'id': 10, 'name': 'Bolton',  'goals_for': '4', 'goal_diff': '1', 'points': '3' },
                { 'id': 8,  'name': 'Arsenal', 'goals_for': '3', 'goal_diff': '3', 'points': '3' },
                { 'id': 12, 'name': 'Norwich', 'goals_for': '1', 'goal_diff': '0', 'points': '1' },
                { 'id': 11, 'name': 'Wigan',   'goals_for': '1', 'goal_diff': '0', 'points': '1' },
                { 'id': 9,  'name': 'QPR',     'goals_for': '0', 'goal_diff': '-4', 'points': '0' }
            ].forEach(testTeamCells);

            done();
        });
    });
});
