import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDeleteComponent } from './mensaje-delete.component';

describe('MensajeDeleteComponent', () => {
  let component: MensajeDeleteComponent;
  let fixture: ComponentFixture<MensajeDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
