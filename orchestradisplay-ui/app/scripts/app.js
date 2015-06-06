var React = window.React = require('react');


var admin = React.createClass({
    getInitialState: function() {
        return {question: '', text: '', changeQuestion:true};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
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
                    <PollQuestion item={this.state.question}/>
                    <form onSubmit={this.handleReplace}>
                        <button>{'Reset question'}</button>
                    </form>
                </div>
            );
        }
    }
});

var response = React.createClass({
    getInitialState: function() {
        return {items: [], text: ''};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    onFormSubmit: function(data, callback) {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: callback,
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var nextItems = this.state.items.concat([this.state.text]);
        var nextText = '';
        this.setState();
        this.props.onFormSubmit({
            url: "/api/submit"
        }, function(data) {
            this.setState({items: nextItems, text: nextText});
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
        alert(this.props.item);
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



