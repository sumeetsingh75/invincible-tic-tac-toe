import { Component, ViewChild } from '@angular/core';
import { GameBoardComponent } from './game-board/game-board.component';
import { appProperties } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  heading = appProperties.heading;
  dialogString = appProperties.dialogString;
  startButtonLabel = appProperties.startGame;
  showOptions: boolean = false;
  result: string;

  @ViewChild(GameBoardComponent, { static: false })
  gamecomponent: GameBoardComponent;

  /**
   * Displays dialog to determine the first player.
   */
  public showOptionsDialog() {
    this.showOptions = true;
    this.startButtonLabel = appProperties.startAgain;
    this.result = "";
    this.gamecomponent.resetBoard();
  }

  /**
   * @param value 
   * Dismisses dialog box and executes player's first move.
   */
  public selectOption(value: string) {
    this.showOptions = false;
    this.gamecomponent.firstMove(value);
  }

  /**
   * @param winner
   * Displays result on UI according to winner. 
   */
  public onWinnerNotified(winner) {
    let resultElement:HTMLElement =  document.getElementsByClassName('winner')[0] as HTMLElement;
    resultElement.style.display = 'block';
    if (winner == appProperties.human) this.result = appProperties.humanWinnerMessage;
    else if (winner == appProperties.computer) this.result = appProperties.computerWinnerMessage;
    else this.result = appProperties.tieMessage;
  }

}
