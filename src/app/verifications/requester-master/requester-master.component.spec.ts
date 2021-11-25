import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterMasterComponent } from './requester-master.component';

describe('RequesterMasterComponent', () => {
  let component: RequesterMasterComponent;
  let fixture: ComponentFixture<RequesterMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequesterMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
