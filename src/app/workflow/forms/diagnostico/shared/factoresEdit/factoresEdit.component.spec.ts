import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoresEditComponent } from './factoresEdit.component';

describe('FactoresEditComponent', () => {
  let component: FactoresEditComponent;
  let fixture: ComponentFixture<FactoresEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoresEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoresEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
