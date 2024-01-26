import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitParamsComponent } from './init-params.component';

describe('InitParamsComponent', () => {
  let component: InitParamsComponent;
  let fixture: ComponentFixture<InitParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitParamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
