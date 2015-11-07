
var path = require('path'),
    chai = require('chai'),
    expect = chai.expect,
    componentPath = path.join(process.cwd(), 'src/client/js/components/');

describe('LeagueTable', function() {
    var React = require('react'),
        ReactTestUtils = require('react-addons-test-utils'),
        $ = require('jquery'),
        LeagueTable = require(path.join(componentPath, 'LeagueTable.js'));

    it('renders', function () {
        var leagueTable = ReactTestUtils.renderIntoDocument(<LeagueTable teams={[]} />),
            tableRows = ReactTestUtils.scryRenderedDOMComponentsWithTag(leagueTable, 'tr'),
            tableHeaders = ReactTestUtils.scryRenderedDOMComponentsWithTag(leagueTable, 'th'),
            tableCells = ReactTestUtils.scryRenderedDOMComponentsWithTag(leagueTable, 'td'),
            headers = [
                'Position', 'Team', 'P', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'
            ];

        expect(ReactTestUtils.isCompositeComponent(leagueTable)).to.be.true;
        expect(tableRows.length).to.equal(1);
        expect(tableHeaders.length).to.equal(10);
        expect(tableCells.length).to.equal(0);
        headers.forEach(function (header, idx) {
            expect(tableHeaders[idx].textContent).to.equal(header);
        });
    });

    it('should build the layout from an array of objects passed as prop', function () {
        var teams = [
            { 'id': 8, 'name': 'Arsenal'},
            { 'id': 9, 'name': 'QPR' },
            { 'id': 10, 'name': 'Bolton' },
            { 'id': 11, 'name': 'Wigan' },
            { 'id': 12, 'name': 'Norwich' }
        ];

        var leagueTable = ReactTestUtils.renderIntoDocument(<LeagueTable teams={teams} />),
            tableBody = ReactTestUtils.findRenderedDOMComponentWithTag(leagueTable, 'tbody'),
            tableRows = $('tr', tableBody);

        expect(tableRows.length).to.equal(5);
        teams.forEach(function (team, idx) {
            var rowCell, position = idx + 1;

            expect(leagueTable.props.teams[idx].position).to.equal(position);

            rowCell = $('.position', tableRows[idx]);;
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
    });
});

