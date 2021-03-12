import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalrComponent } from './modalr.component';

describe('ModalrComponent', () => {
  let component: ModalrComponent;
  let fixture: ComponentFixture<ModalrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
