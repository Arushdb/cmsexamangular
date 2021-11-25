import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRequesterComponent } from './approve-requester.component';

describe('ApproveRequesterComponent', () => {
  let component: ApproveRequesterComponent;
  let fixture: ComponentFixture<ApproveRequesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveRequesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
