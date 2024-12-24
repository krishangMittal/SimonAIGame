var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;

$(document).keypress(function() {
  if (!started) {
    started = true;
    nextSequence();  // This will increment level and update the text
  }

});
$(document).ready(function () {
  setTimeout(() => {
    $("#splash-screen").fadeOut(500, function () {
      $("#level-title, .progress-bar, .container").fadeIn(500);
    });
  }, 3000);
});

$(".btn").on("click touchstart", function () {
  if (started) {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
  }
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    console.log("Success");

    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);

    const gameOverMessages = [
      "The AI has taken over. Humanity is doomed.",
      "You fought bravely, but the AI prevailed.",
      "Resistance is futile. The AI reigns supreme.",
      "The AI has outsmarted you. Better luck next time!",
      "The system has fallen to the AI. Try again.",
      "Humanity's last hope has faded... for now."
    ];

    const randomMessage = gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)];
    $("#level-title").text(randomMessage);
    
    gameOver(); // Call gameOver() function before starting over
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

function gameOver() {
  const currentLevel = level; // Store the current level before resetting
  const playerName = prompt("Enter your name for the leaderboard:");
  
  if (playerName) {
    import('https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js')
      .then(({ getDatabase, ref, push, set }) => {
        const database = getDatabase();
        const scoresRef = ref(database, 'scores');
        const newScoreRef = push(scoresRef);
        
        // Save the current level before resetting it
        set(newScoreRef, {
          name: playerName,
          score: currentLevel, // Use the stored level
          timestamp: Date.now()
        });
      })
      .catch(error => console.error('Error saving score:', error));
  }
  
  startOver(); // Reset the game after saving the score
}
