var Client = require('../utils/client.jsx');
var UserStore = require('../stores/user_store.jsx');

var ENTER = 13;
module.exports = React.createClass({
    displayName: 'Dialer',
    keyPressHandler: function(event) {
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if(keyCode == ENTER) {
            this.dial(event.target.value);
        }
    },
    clickHandler: function() {
        this.dial($('#dialer').val());
    },
    dial: function(number) {
        if($.isNumeric(number)) {
            var userName = UserStore.getCurrentUser().username;
            Client.dial(userName, number);
        }
    },
    render: function() {
        return (
            <form className="dialer__form relative-div" action="#">
                <div className="dialer_box">
                    <input type="text" className="form-control dialer" placeholder="Appeler" onKeyPress={this.keyPressHandler} id="dialer"/>
                </div>
                <div className="glyphicon glyphicon-earphone dialer_button" onClick={this.clickHandler}></div>
            </form>
            )
    }
});