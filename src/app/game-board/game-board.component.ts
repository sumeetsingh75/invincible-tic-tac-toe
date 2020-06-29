import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { appProperties } from '../app.constants';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})

export class GameBoardComponent implements OnInit {
  @Output() notifyWinner: EventEmitter<string> = new EventEmitter<string>(); /* Event emitter to notify winner to parent component */
  displayBoard: string[];
  board: number[];
  humanPlayer: string = appProperties.human;
  computerPlayer: string = appProperties.computer;
  humanMove: number = -1;     /* Human move is denoted by -1. */
  computerMove: number = 1;   /* Computer move is denoted by +1. */
  canPlay: boolean = false;  /* Maintains status if game can be played furthur. */
  currentPlayer: string;  /* Player playing the current move. */

  constructor() { }

  ngOnInit() {
    this.displayBoard = ["", "", "", "", "", "", "", "", ""];
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  /**
   * @param player 
   * Method assigns player chosen by user to currentPlayer.
   * Executes computer move if user didn't choose to go first.
   */
  public firstMove(player: string) {
    this.canPlay = true;
    this.currentPlayer = player;
    if (player == this.computerPlayer) this.playComputerMove(this.board);
  }

  /**
   * Resets game board to initial state. 
   */
  public resetBoard() {
    this.displayBoard = ["", "", "", "", "", "", "", "", ""];
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.canPlay = false;
  }

  /**
   * @param cell 
   * Executes move in user-selected cell of 3 * 3 board.
   */
  public playHumanMove(cell: number) {
    if (this.currentPlayer == this.humanPlayer && this.board[cell] == 0) {
      this.board[cell] = this.humanMove;
      this.displayBoard[cell] = "X";
      this.currentPlayer = this.computerPlayer;
    }
  }

  /**
   * @param cell
   * Controls entire game by assigning alternate turns to both players and ends game 
   * if there is any winner or game gets draw. 
   */
  public gameController(cell: number) {
    if (this.canPlay) {
      this.playHumanMove(cell);
      let winner = this.hasWon(this.board);
      if (winner != null) {
        this.declareWinner(winner);
        this.canPlay = false;
      }
    }

    if (this.canPlay) {
      this.playComputerMove(Object.assign([], this.board));
      let winner = this.hasWon(this.board);
      if (winner != null) {
        this.declareWinner(winner);
        this.canPlay = false;
      }
    }
  }

  /**
   * @param board 
   * Determines if a player has won.
   * returns -1 for human, +1 for computer, 0 for draw and null if game is not yet completed.
   */
  public hasWon(board: number[]): number {
    let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; /* Winning Positions */
    for (let i = 0; i < wins.length; ++i) {
      if (board[wins[i][0]] != 0 &&
        board[wins[i][0]] == board[wins[i][1]] &&
        board[wins[i][0]] == board[wins[i][2]])
        return board[wins[i][2]];
    }
    if (this.isBoardFull(board)) return 0;
    else return null;
  }

  /**
   * @param board
   * Returns the positions of winning cells  
   */
  public getWinningCells(board: number[]): number[] {
    let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < wins.length; ++i) {
      if (board[wins[i][0]] != 0 &&
        board[wins[i][0]] == board[wins[i][1]] &&
        board[wins[i][0]] == board[wins[i][2]])
        return [wins[i][0], wins[i][1], wins[i][2]];
    }
  }

  /**
   * @param winningCells 
   * Highlights the winning cells in UI by adding a class to DOM elements
   */
  public highlightBoardCells(winningCells: number[]) {
    for (var i = 0; i < winningCells.length; i++) {
      document.getElementById(winningCells[i] + "").classList.add("winner-cell");
    }
  }

  /**
   * @param winner
   * Emits event to the parent class notify the winnner of Game.
   */
  public declareWinner(winner: number) {
    if (winner != 0)
      setTimeout(() => { this.highlightBoardCells(this.getWinningCells(this.board)); }, 0);
    if (winner == 0) this.notifyWinner.emit(appProperties.tie);
    else if (winner == 1) this.notifyWinner.emit(appProperties.computer);
    else this.notifyWinner.emit(appProperties.human);
  }

  /**
   * @param a 
   * @param b 
   * Returns maximum of the two numbers
   */
  public max(a: number, b: number): number {
    return a > b ? a : b;
  }

  /**
   * @param a 
   * @param b 
   * Returns minimum of the two numbers
   */
  public min(a: number, b: number): number {
    return a < b ? a : b;
  }

  /**
   * @param board 
   * Identifies and executes the most optimised computer move using Minimax algorithm
   */
  public playComputerMove(board: number[]) {
    if (this.currentPlayer == this.computerPlayer) {
      let bestMove = -1;
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
          board[i] = this.computerMove;
          let score = this.minimax(board, false);
          board[i] = 0;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      this.board[bestMove] = this.computerMove;
      this.displayBoard[bestMove] = 'O';
      this.currentPlayer = this.humanPlayer;
    }
  }

  /**
   * @param board 
   * Determines if the board is full
   */
  public isBoardFull(board: number[]): boolean {
    for (let i = 0; i < board.length; i++) {
      if (board[i] == 0) return false;
    }
    return true;
  }

  /**
   * @param board 
   * @param isMaximizing 
   * Minimax Implementtaion. 
   * Algorithm returns the best score that can be achieved by executing a particular move
   */
  public minimax(board: number[], isMaximizing: boolean): number {
    let winner = this.hasWon(board);
    if (winner != null) return winner;
    let bestScore = 0;
    if (isMaximizing) {
      bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
          board[i] = this.computerMove;
          bestScore = this.max(bestScore, this.minimax(board, !isMaximizing));
          board[i] = 0;
        }
      }

    } else {
      bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
          board[i] = this.humanMove;
          bestScore = this.min(bestScore, this.minimax(board, !isMaximizing));
          board[i] = 0;
        }
      }
    }
    return bestScore;
  }

}


