var jeopardyGame = (function() {
    var gameStatus = [];
    var results = [];
    var right = [];
    var wrong = [];
    // local storage setup
    var storage = {
        set: function() {
            localStorage.setItem("results", JSON.stringify(gameStatus));
        },
        get: function() {
            var results = localStorage.results === undefined ? false : JSON.parse(localStorage.results);
            return results;
        }
    };
    // jeopardy API call for random question
    function getJeopardy() {
        $.ajax({
            'method': 'GET',
            'url': 'http://jservice.io/api/random',
            'dataType': 'json',
            'success': function(data) {
                var newData = data[0];
                if (newData.value) {
                    jeopardyContext(newData);
                } else {
                    getJeopardy();
                }
            }
        });
    }
    // set context of jeopardy response
    function jeopardyContext(data) {
        var context = {
            question: data.question,
            answer: data.answer,
            category: data.category.title.toUpperCase(),
            value: data.value
        };
        new GameObject(context);
    }
    // check to see if user's answer is right
    GameObject.prototype.checkAnswer = function(userAnswer) {
        if (userAnswer === this.info.answer) {
            results.push(Number(this.info.value));
            right.push(Number(this.info.value));
        } else {
            results.push(Number('-' + this.info.value));
            wrong.push(Number(this.info.value));
        }
        this.getScore();
        this.getRight();
        this.getWrong();
    };
    // get total score and update screen
    GameObject.prototype.getScore = function(userAnswer) {
        var addResults = results.reduce(add, 0);
        function add(a, b) {
            return a + b;
        }
        this.scoreTotal = Number(addResults);
        $('.score').text(this.scoreTotal);
    };
    // get number of right answers and update screen
    GameObject.prototype.getRight = function(userAnswer) {
        var numRight = right.length;
        this.rightAnswers = numRight;
        $('.right').text(this.rightAnswers);
        $('.jeopardy-block').css({
            'backgroundColor': '#55AE3A',
        }).fadeOut(1000, function() {
          $('.container').empty();
            getJeopardy();
        });
    };
    // get number of wrong answers and update screen
    GameObject.prototype.getWrong = function(userAnswer) {
        var numWrong = wrong.length;
        this.wrongAnswers = numWrong;
        $('.wrong').text(this.wrongAnswers);
        $('.jeopardy-block').css({
            'backgroundColor': '#FF0000',
        }).fadeOut(1000, function() {
            getJeopardy();
        });
    };
    // build question interface
    GameObject.prototype.buildQuestion = function() {
        var source = $('#question-template').html(),
            template = Handlebars.compile(source),
            context = this.info,
            html = template(context);
        $(html).prependTo('.container').fadeIn();
    };
    // game object constructor
    function GameObject(context) {
        this.info = context;
        this.buildQuestion();
        getUserInput(this);
        gameStatus.push(this);
        storage.set();
    }
    // play button handler
    $('footer').on('click', '.play-btn', function(event) {
        event.preventDefault();
        $('.container, .score, .right, .wrong').empty();
        getJeopardy();
    });
    // get user's guess
    function getUserInput(game) {
        // user input handler
        $('.container').on('submit', 'form', function(event) {
            event.preventDefault();
            var userAnswer = $('.user-guess').val();
            game.checkAnswer(userAnswer);
            $('.container').off('submit', 'form');
        });
    }
})();
