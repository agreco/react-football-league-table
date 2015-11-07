
var React = require('react'),
    TeamRow = React.createClass({
        displayName: 'TeamRow',
        render: function() {
            var team = this.props.team;
            return (
                <tr>
                    <td className='position'>{ team && team.position ? team.position : 0 }</td>
                    <td className='team'>{ team && team.name ? team.name : "" }</td>
                    <td className='played'>{ team && team.played ? team.played : 0 }</td>
                    <td className='won'>{ team && team.won ? team.won : 0 }</td>
                    <td className='drawn'>{ team && team.drawn ? team.drawn : 0 }</td>
                    <td className='loss'>{ team && team.loss ? team.loss : 0 }</td>
                    <td className='goalsFor'>{ team && team.goalsFor ? team.goalsFor : 0 }</td>
                    <td className='goalsAgainst'>{ team && team.goalsAgainst ? team.goalsAgainst : 0 }</td>
                    <td className='goalsDifference'>{ team && team.goalDifference ? team.goalDifference : 0 }</td>
                    <td className='points'>{ team && team.points ? team.points : 0 }</td>
                </tr>
            );
        }
    });

module.exports = TeamRow;