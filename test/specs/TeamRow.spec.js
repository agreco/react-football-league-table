
var path = require('path'),
    chai = require('chai'),
    expect = chai.expect,
    componentPath = path.join(process.cwd(), 'src/client/js/components/');

describe('TeamRow', function() {
    it('renders', function() {
        var React = require('react'),
            ReactTestUtils = require('react-addons-test-utils'),
            TeamRow = require(path.join(componentPath, 'TeamRow.js'));

        // Render a team row in the document
        var teamRow = ReactTestUtils.renderIntoDocument(<TeamRow />);
        expect(ReactTestUtils.isCompositeComponent(teamRow)).to.be.true;
    });
});
