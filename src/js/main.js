var jeopardyGame = (function() {
    var allQuestions = [];
    var results = [];
    // var right = [];
    // var wrong = [];
    // local storage setup
    var storage = {
        set: function() {
            // localStorage.setItem("results", JSON.stringify(allQuestions));
        },
        get: function() {
            // var ghosts = localStorage.ghosts === undefined ? false : JSON.parse(localStorage.ghosts);
            // return ghosts;
        },
        clear: function() {
            // localStorage.removeItem('ghosts');
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
                jeopardyContext(newData);
            }
        });
    }
    function jeopardyContext(data) {
        var context = {
            question: data.question,
            answer: data.answer,
            category: data.category.title.toUpperCase(),
            value: data.value
        };
        new GameObject(context);
    }

    function getResult() {
      if (userAnswer === this.info.answer) {
        results.push(this.info.value);
      } else {
        results.push('-' + this.info.value);
      }
      console.log(results);
      // GameObject.totalScore = 0;
    }

    GameObject.prototype.buildQuestion = function() {
        var source = $('#question-template').html(),
            template = Handlebars.compile(source),
            context = this.info,
            html = template(context);
        $(html).prependTo('.container').fadeIn();
        // return $('.ghost').first();
    };
    // game object constructor
    function GameObject(context) {
        this.info = context;
        this.buildQuestion();
        // var totalScore
        // var numRight
        // var numWrong
        allQuestions.push(this);
        storage.set();
    }
    // play button handler
    $('footer').on('click', '.play-btn', function(event) {
        event.preventDefault();
        getJeopardy();
    });
    // user input handler
    $('form').on('submit', function(event) {
        event.preventDefault();
        var userAnswer = $('.user-guess').val();
        getResult();
        $('.user-guess').val('');
    });
})();
