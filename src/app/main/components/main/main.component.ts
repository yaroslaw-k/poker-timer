import {Component, HostListener} from '@angular/core';
import {PokerTimerService} from "../../../services/poker-timer.service";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(public pt: PokerTimerService) {

  }

  startOrStopTimer(): void {
    if (this.pt.isRunning) {
      this.pt.stopTimer();
    } else {
      this.pt.startTimer();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === ' ') {
      this.startOrStopTimer();
    }
  }



}
