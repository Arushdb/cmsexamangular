import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRollNumberComponent } from './add-roll-number.component';

describe('AddRollNumberComponent', () => {
  let component: AddRollNumberComponent;
  let fixture: ComponentFixture<AddRollNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRollNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRollNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
