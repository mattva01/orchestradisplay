var React = window.React = require('react');
var Firebase = window.Firebase = require('firebase');

var admin = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return {items: [], question: '' , text: '', changeQuestion:false};

    },
    componentWillMount: function() {
        this.firebaseRef = new Firebase("https://orchestradisplay.firebaseio.com/event/");
        this.bindAsObject(this.firebaseRef, "items");

    },
    componentDidUpdate: function() {
        this.setState({question: this.state.items["question"].text});
    },
    componentWillUnmount: function() {
        this.unbind("items");
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var questionRef = new Firebase('https://orchestradisplay.firebaseio.com/event/question');
        questionRef.update({
            text: this.state.text
        });
        this.setState({
                question: this.state.text,
                text: '',
                changeQuestion: false
            });
    },
    handleReplace: function(e) {
        this.setState({
            question: this.state.question,
            text: this.state.text,
            changeQuestion: true
        });
    },
    render: function() {
        if(this.state.changeQuestion) {
            return (
                <div>
                    <h3>Poll question</h3>
                    <br/>Current question: {this.state.question}
                    <form onSubmit={this.handleSubmit}>
                        <textarea rows="2" columns="50" onChange={this.onChange} value={this.state.text}/>
                        <br/>
                        <button>{'Set question'}</button>
                    </form>
                </div>
            );
        } else {
            return (
                <div>
                    <h3>Poll question</h3>
                    <br/>Current question: {this.state.question}
                    <form onSubmit={this.handleReplace}>
                        <button>{'Reset question'}</button>
                    </form>
                </div>
            );
        }
    }
});

var response = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return {items: [], question: '', answer:'', text: ''};
    },
    componentWillMount: function() {
        this.firebaseRef = new Firebase("https://orchestradisplay.firebaseio.com/event/");
        this.bindAsObject(this.firebaseRef, "items");

    },
    componentDidUpdate: function() {
        this.setState({question: this.state.items["question"].text});
    },

    onChange: function(e) {
        this.setState({text: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var answersRef = new Firebase('https://orchestradisplay.firebaseio.com/event/answers');
        answersRef.push({
            text: this.state.text
        });
        this.setState({
            question: this.state.question,
            answer: this.state.text,
            text: ''
        });
    },
    render: function() {
        return (
            <div>
                <h3>{this.state.question}</h3>
                <form onSubmit={this.handleSubmit}>
                    <textarea rows="2" columns="50" onChange={this.onChange} value={this.state.text}/><br/>
                    <button>{'Submit'}</button>
                </form>
            </div>
        );
    }
});

var PollQuestion = React.createClass({
    render: function() {
        return <div align="center">{this.props.item}</div>;
    }
});


var OperaPollingApp = React.createClass({
    render() {
        var Child;
        switch (this.props.route) {
            case 'admin':
                Child = admin;
                break;
            case 'response':
                Child = response;
                break;
            default:
                Child = response;
        }

        return (
            <div>
                <Child/>
            </div>
        )
    }
});

function render () {
    var route = window.location.hash.substr(2);
    React.render(<OperaPollingApp route={route} />, document.getElementById("app"));
}

window.addEventListener('hashchange', render);
render(); // render initially



