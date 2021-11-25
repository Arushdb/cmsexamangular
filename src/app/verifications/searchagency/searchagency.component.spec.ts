import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchagencyComponent } from './searchagency.component';

describe('SearchagencyComponent', () => {
  let component: SearchagencyComponent;
  let fixture: ComponentFixture<SearchagencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchagencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchagencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
