
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;

//1. Use jQuery to detect when a keyboard key has been pressed, when that happens for the first time, call nextSequence().
$(document).keypress(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});


$(document).ready(function () {
  // Show the splash screen for 3 seconds
  setTimeout(() => {
    $("#splash-screen").fadeOut(500, function () {
      $("#level-title, .progress-bar, .container").fadeIn(500);
    });
  }, 3000); // Change duration as needed (3000ms = 3 seconds)
});


$(".btn").on("click touchstart", function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);

  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length-1);


});


function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] == userClickedPattern[currentLevel]) { 

      console.log("Success");

      if (userClickedPattern.length === gamePattern.length){
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

      // Array of random game-over messages
      const gameOverMessages = [
          "The AI has taken over. Humanity is doomed.",
          "You fought bravely, but the AI prevailed.",
          "Resistance is futile. The AI reigns supreme.",
          "The AI has outsmarted you. Better luck next time!",
          "The system has fallen to the AI. Try again.",
          "Humanity's last hope has faded... for now."
      ];

      // Choose a random message
      const randomMessage = gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)];

      // Display the random game-over message
      $("#level-title").text(randomMessage);

      // Restart the game
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