import {Injectable, TemplateRef} from '@angular/core';
import {placesDistribution, PlayerModel, PrizeDistribution, TimerModel} from "../models/timer-models";
import {Observable, Subscription, timer} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InitParamsComponent} from "../main/components/init-params/init-params.component";


const LS_KEY = '_poker-timer';
const DEFAULT_STATE: TimerModel = {
  timeLine: [
    {durationSec: 900, type: 'blind', smallBlind: 5, bigBlind: 10},
    {durationSec: 720, type: 'blind', smallBlind: 10, bigBlind: 20},
    {durationSec: 720, type: 'blind', smallBlind: 15, bigBlind: 30},
    {durationSec: 720, type: 'blind', smallBlind: 20, bigBlind: 40},
    {durationSec: 720, type: 'blind', smallBlind: 30, bigBlind: 60},
    {durationSec: 600, type: 'break'},
    {durationSec: 720, type: 'blind', smallBlind: 40, bigBlind: 90},
    {durationSec: 720, type: 'blind', smallBlind: 50, bigBlind: 100},
    {durationSec: 720, type: 'blind', smallBlind: 60, bigBlind: 120},
    {durationSec: 720, type: 'blind', smallBlind: 80, bigBlind: 160},
    {durationSec: 720, type: 'blind', smallBlind: 90, bigBlind: 180},
    {durationSec: 720, type: 'blind', smallBlind: 100, bigBlind: 200},
    {durationSec: 600, type: 'break'},
    {durationSec: 600, type: 'blind', smallBlind: 150, bigBlind: 300},
    {durationSec: 600, type: 'blind', smallBlind: 200, bigBlind: 400},
    {durationSec: 600, type: 'blind', smallBlind: 250, bigBlind: 500},
    {durationSec: 600, type: 'blind', smallBlind: 300, bigBlind: 600},
    {durationSec: 600, type: 'blind', smallBlind: 400, bigBlind: 800},
    {durationSec: 600, type: 'blind', smallBlind: 500, bigBlind: 1000},
    {durationSec: 600, type: 'blind', smallBlind: 600, bigBlind: 1200},
    {durationSec: 600, type: 'blind', smallBlind: 800, bigBlind: 1600},
    {durationSec: 600, type: 'blind', smallBlind: 1000, bigBlind: 2000},
  ],
  currentTimeLineIndex: 0,
  isRunning: false,
  currentTimeSec: 0,
  entryFee: 20,
  entryCap: 1000,
  players: []
}

@Injectable({
  providedIn: 'root'
})
export class PokerTimerService {

  constructor(private modal: NgbModal) {
    this.loadFromLocalStorage();
  }

  private timer$: Observable<number> = timer(1000, 1000);

  private timerSubscription?: Subscription;

  private state: TimerModel = DEFAULT_STATE;


  public loadFromLocalStorage(): void {
    let savedState = localStorage.getItem(LS_KEY) ? JSON.parse(localStorage.getItem(LS_KEY) || '') as TimerModel : DEFAULT_STATE;

    const modalRef = this.modal.open(InitParamsComponent, {backdrop: "static"});
    modalRef.componentInstance.state = savedState;
    modalRef.result.then(((newState) => {
      if (newState) {
        this.state = newState;
        this.state.isRunning = false;
      } else {
        this.state = savedState;
        this.state.isRunning = false;
      }
      this.startTimer();
    }))
  }


  public startTimer(): void {
    if (!this.state.isRunning) {
      this.state.isRunning = true;
      this.timerSubscription = this.timer$.subscribe(() => this.updateState());
    }
  }

  public stopTimer(): void {
    if (this.state.isRunning && this.timerSubscription) {
      this.state.isRunning = false;
      this.timerSubscription.unsubscribe();
    }
  }

  private updateState(): void {
    if (this.state.currentTimeLineIndex < this.state.timeLine.length) {
      this.state.currentTimeSec++;

      const currentTimelineItem = this.state.timeLine[this.state.currentTimeLineIndex];
      if (this.state.currentTimeSec >= currentTimelineItem.durationSec) {
        this.state.currentTimeLineIndex++;
        this.state.currentTimeSec = 0;
      }
    } else {
      const lastTimelineItem = this.state.timeLine[this.state.timeLine.length - 1];
      if (lastTimelineItem.type === 'blind') {
        this.state.timeLine.push({
          ...lastTimelineItem,
          bigBlind: lastTimelineItem.bigBlind * 2,
          smallBlind: lastTimelineItem.smallBlind * 2
        });
      } else {
        this.state.timeLine.push({...lastTimelineItem});
      }
    }
    this.saveInLocalStorage();
  }

  public getState(): TimerModel {
    return this.state;
  }

  public saveInLocalStorage(): void {
    localStorage.setItem(LS_KEY, JSON.stringify(this.state));
  }


  public get leftMinutesAndSeconds(): { minutes: number, seconds: number } {
    if (this.state.timeLine[this.state.currentTimeLineIndex]?.durationSec) {
      const minutes = Math.floor((this.state.timeLine[this.state.currentTimeLineIndex].durationSec - this.state.currentTimeSec) / 60);
      const seconds = (this.state.timeLine[this.state.currentTimeLineIndex].durationSec - this.state.currentTimeSec) % 60;
      return {minutes, seconds};
    }
    return {minutes: 0, seconds: 0}

  }

  public get blinds(): { smallBlind: number, bigBlind: number } | undefined {
    const currentTimelineItem = this.state.timeLine[this.state.currentTimeLineIndex];
    if (currentTimelineItem.type === 'blind') {
      return {smallBlind: currentTimelineItem.smallBlind, bigBlind: currentTimelineItem.bigBlind};
    }
    return undefined;
  }

  public get isRunning(): boolean {
    return this.state.isRunning;
  }

  public get players(): PlayerModel[] {
    return this.state.players;
  }

  public get buyInCount(): number {
    return this.state.players.reduce((sum, player) => sum + player.buyIns, 0);
  }

  public get totalBank(): number {
    return this.state.players.reduce((sum, player) => sum + player.buyIns * this.state.entryFee, 0);
  }

  public get prizeDistribution(): Array<PrizeDistribution> {
    const totalBuyIns = this.state.players.reduce((sum, player) => sum + player.buyIns, 0);
    return placesDistribution(totalBuyIns);
  }

  addBuyIn(playerIndex: number) {
    this.state.players[playerIndex].buyIns++;
    this.saveInLocalStorage();
  }

  removeBuyIn(playerIndex: number) {
    this.state.players[playerIndex].buyIns--;
    this.saveInLocalStorage();
  }

  addPlayer(addPlayerRef: TemplateRef<any>) {
    const modalRef = this.modal.open(addPlayerRef).result.then((playerName: string) => {
      if (playerName) {
        this.state.players.push({name: playerName, buyIns: 1});
        this.saveInLocalStorage();
      }
    });
  }


  removePlayer(playerIndex: number) {
    this.state.players.splice(playerIndex, 1);
    this.saveInLocalStorage();
  }


}
