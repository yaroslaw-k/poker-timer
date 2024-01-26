import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimerModel, BlindModel, BreakModel } from '../../../models/timer-models';
import {FormControl, FormGroup, FormArray, FormBuilder, ReactiveFormsModule, UntypedFormArray} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-init-params',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './init-params.component.html',
  styleUrls: ['./init-params.component.scss']
})
export class InitParamsComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() state!: TimerModel;

  public paramsForm = new FormGroup({
    entryFee: new FormControl(0),
    entryCap: new FormControl(0),
    currentTimeLineIndex: new FormControl(0),
    timeLine: new UntypedFormArray([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.paramsForm.setControl('entryFee', new FormControl(this.state?.entryFee || 0));
    this.paramsForm.setControl('entryCap', new FormControl(this.state?.entryCap || 0));
    this.paramsForm.setControl('currentTimeLineIndex', new FormControl(this.state?.currentTimeLineIndex || 0));

    const timeLineFormGroups = this.state?.timeLine?.map(item => this.createTimelineFormGroup(item)) || [];
    this.paramsForm.setControl('timeLine', new FormArray(timeLineFormGroups));
  }

  private createTimelineFormGroup(item: BreakModel | BlindModel): FormGroup {
    if (item.type === 'break') {
      return this.fb.group({
        durationSec: item.durationSec,
        type: item.type
      });
    } else {
      return this.fb.group({
        durationSec: item.durationSec,
        type: item.type,
        smallBlind: item.smallBlind,
        bigBlind: item.bigBlind
      });
    }
  }

  get timeLine(): FormArray {
    return this.paramsForm.get('timeLine') as FormArray;
  }

  public addBlinds(): void {
    const newBlind: BlindModel = {
      durationSec: 0,
      type: 'blind',
      smallBlind: 0,
      bigBlind: 0
    };
    this.timeLine.push(this.fb.group(newBlind));
  }

  public addBreak(): void {
    const newBreak: BreakModel = {
      durationSec: 0,
      type: 'break'
    };
    this.timeLine.push(this.fb.group(newBreak));
  }

  public apply(): void {
    let value = {...this.state, ... this.paramsForm.value};
    debugger;
    this.activeModal.close(value);
  }
}
