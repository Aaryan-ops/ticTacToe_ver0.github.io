/*#############Initial setup. Three containers, board, hu and ai respectively the board cell indices, human player character and ai player character. ################*/
var board;
const hu = "O";
const ai = "X";

/* The winning combinations are noted and registerd for deciding the outcome of the game.*/
const winCombos = [
  [6, 4, 2],
  [0, 4, 8],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6],
  [6, 7, 8],
  [3, 4, 5],
  [0, 1, 2],
];

/* Getting a handle on all the individual spots.*/
const cells = document.querySelectorAll(".spot");

/*###################################### Setup ends ###################################################################################*/

/*################################## Functional block definitions  start #############################################################*/

/*reset() function.
**What it does
   1.Turns-off display of the dialog that shows game-outcome.
   2. Stores individual spot indicies in the board container. The board at this point contains data of type number. Later, character types will be stored here to keep track of filled-in spots.

   3. For each spot, sets data to an empty string, removes the outcome-dependent-background-color that was rendered, and stores a listener in each of the spots, to listen for data-input interaction via mouse-click. 
*/

function reset() {
  document.querySelector(".dialog").style.display = "none";
  board = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", attendUserTurn, false);
  }
}

/*
attendUserTurn(param) function.
---------------------------
This is a routine that is dependent on three subroutines  boolean checkTie(), turn() and aiSpot(), that returns the next empty spot for the ai Player to put its character in. 
The checTie() subroutine tells if I have all the spots filled already? 
The aiSpot() subroutine returns an empty spot for the ai to put 'X' in.
The registerTurn(param1,param2) subroutine attends the turn of a player. 

Working.
--------
1.Take the clicked-on spot as input.
2. Attend the turn of the player, the user-player. The board field keeps track of filled-in spots, by checking if the datum in a spot is indeed a number. If it is indeed a number type, then I can safely register the user-input requested by click at this clicked on cell's index, otherwise, it means that there is already a character (non-num type ) in there.
3.Check if the entire board gets filled, in which case it has to be a tie as no more moves are possible. 
4. This attendUserTurn subroutine first registers user's input and then registers the turn of the ai player if there is no tie.
*/

function attendUserTurn(square) {
  if (typeof board[square.target.id] == "number") {
    registerTurn(square.target.id, hu);

    if (!checkTie()) {
      registerTurn(aiSpot(), ai);
    }
  }
}

/*
registerTurn(param1,param2) subroutine.
---------------------------------
Summary
-------

This function attends a turn of a player delegated to it, and sets the board display and the game status accordingly. It uses checkWin(param1,param2) sub routine to look up the object data of the player who has won, based on the current board and player input. This returned object is used as a boolean value in a conditional block. An empty object means false and that no one has won yet.

Working
-------
1.Take the current spot via its id and the player character as input.
2.Display the player's character.
3. Check if the game is over by checking if someone has one, i.e, if someone has the winning combination first. This is delegated to the checkWin sub-routine.
4. Call gameOver() routine to declare the winner on the display in case the gameWon() sub-routine returns a non-empty object.
*/

function registerTurn(squareId, player) {
  board[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(board, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

/*
    checkWin(param1,param2)
    -----------------------
    This funcion checks if a player has just  established a winning combination . It tells if someone has won the game, so that it can be ended.  It says true by returning a non-empty object composed of   the player character and the winning combination. It says not true by returning an empty object otehrwise.

    Working
    --------
    1.Take in the array of spot indices and the player character as inputs.
    2. Get the list of all the moves by the player upto current point in time.
    3. See if any of the winning combo lists has its elements in the player-moves array obtained above.
    4. Tell me if someone has won by returning me an object.
*/

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e == player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    } //includes
  }
  return gameWon;
}

/*
gameOver(param)
--------------

Summary
-------
Takes in an object and declares a statement in the dialog box div-element. Uses declareWinner() sub-routine for the declaration.

Working
-------
1. Take in the player info object which has the winning combo and the player's charcter. Use it to declare the winning statement in the div dialog box.
2. The background color of a winning streak cell is set to blue for the human player and red for the ai player.
3. I freeze the board so that no further input is possible, by removing the lister for clicks.
4. Call the declareWinner subroutine that prepares the declaration statement display dialog to present the statement.
*/

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == hu ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", attendUserTurn, false);
  }
  declareWinner(gameWon.player == hu ? "You win!" : "AI wins!");
}

/*
    declareWinner(param)
    --------------------

    Summary
    -------
    Take in the declaration string , and show ite by displaying a dialog-box on the viewport.

    Working
    ------
    1. Take the declaration string as input and paste it on the dialog box.
    2. Make the box visible.

*/

function declareWinner(who) {
  document.querySelector(".dialog").style.display = "block";
  document.querySelector(".dialog .message").innerHTML = who;
}

/*
    emptySpots() Helper function.
    -----------------------------
    Tell me if a spot is empty by checking the data type in the board array. The board array is initially populated with indices of the spots which are of numeric type. The corresponding array cells are filled with character types as players' characters are stored in the spots.

    This function helps the aiSpot() subroutine in finding an empty spotFor the ai player.


*/
function emptySpots() {
  return board.filter((cellData) => typeof cellData == "number");
}

/*
    aiSpot() subroutine
    -------------------

    Delegates finding of the next empty spot for the ai's character to emptySpots() helper function, and returns the find, so that the ai is passive and doesn;t care to win. It just fills the next empty spot it finds.

*/

function aiSpot() {
  return emptySpots()[0];
}

/*

    checkTie()
    ----------

    Summary
    -------
    Tell me if all the cells are filled with character types. Uses emptrySports() to determine the datatype of the data in a spot as an indication of whether or not it is filled. A numeric value in the board array means empty cell and an non-numeric (char) value means it is occupied.

    Working
    --------
    1. Check if the array of empty spots is empty. 
    2.If it is, then, it's indicative of a tie.  The cells are painted green and the input frozen. And declaration of winner is on the way. This function returns true while calling the declareWinner() subroutine.
    3. It its not empty then its not a tie.
*/

function checkTie() {
  if (emptySpots().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", attendUserTurn, false);
    }
    declareWinner("Game Tied!");
    return true;
  }
  return false;
}

/* #######################################Functional block definitions end  #############################################*/

/*###################################### Routine calls ############################################################*/

/**
 *
 *Call the functional block bound to the button element to set it into effect.
 */

reset();
