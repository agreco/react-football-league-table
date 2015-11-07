
var React = require('react'),
    TeamRow = require(__dirname + '/TeamRow.js'),
    LeagueTable = React.createClass({ displayName: 'LeagueTable',
        render: function() {
            var rows = [];

            this.props.teams.forEach(function (team, idx) { // TODO: CHANGE DIRECT MUTATION OF STATE to use setState!!!!
                team.position = ++idx;
                rows.push(<TeamRow team={team} key={team.id} />);
            }.bind(this));

            return (
                <table className='league'>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th className='team-header'>Team</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>F</th>
                            <th>A</th>
                            <th>GD</th>
                            <th>Pts</th>
                         </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            );
        }
    });
module.exports = LeagueTable;
