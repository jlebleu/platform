var Client = require('../utils/client.jsx');
var UserStore = require('../stores/user_store.jsx');

var ENTER = 13;
export default class DeletePostModal extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Dialer';

        this.keyPressHandler = this.keyPressHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.dial = this.dial.bind(this);
    }
    keyPressHandler(event) {
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode === ENTER) {
            this.dial(event.target.value);
        }
    }
    clickHandler() {
        this.dial($('#dialer').val());
    }
    dial(number) {
        if ($.isNumeric(number)) {
            var userName = UserStore.getCurrentUser().username;
            Client.dial(userName, number);
        }
    }
    render() {
        return (
            <form
                className='dialer__form relative-div'
                action='#'
            >
                <div
                    className='dialer_box'
                >
                    <input
                        type='text'
                        className='form-control dialer'
                        placeholder='Appeler'
                        onKeyPress={this.keyPressHandler}
                        id='dialer'
                    />
                </div>
                <div
                    className='glyphicon glyphicon-earphone dialer_button'
                    onClick={this.clickHandler}
                >
                </div>
            </form>
        );
    }
}