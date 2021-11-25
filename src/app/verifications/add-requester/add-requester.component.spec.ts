import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequesterComponent } from './add-requester.component';

describe('AddRequesterComponent', () => {
  let component: AddRequesterComponent;
  let fixture: ComponentFixture<AddRequesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRequesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
