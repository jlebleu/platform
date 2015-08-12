var Client = require('../utils/client.jsx');
var UserStore = require('../stores/user_store.jsx');

var ENTER = 13;
module.exports = React.createClass({
    displayName: 'Dialer',
    keyPressHandler: function(event) {
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if(keyCode == ENTER && $.isNumeric(event.target.value)) {
            var userName = UserStore.getCurrentUser().username;
            Client.dial(userName, event.target.value);
        }
    },
    render: function() {
        return (
            <form className="dialer__form relative-div" action="#">
                <input type="text" className="form-control dialer" placeholder="Appeler" onKeyPress={this.keyPressHandler} />
            </form>
            )
    }
});