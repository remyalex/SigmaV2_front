import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeEditComponent } from './mensaje-edit.component';

describe('MensajeEditComponent', () => {
  let component: MensajeEditComponent;
  let fixture: ComponentFixture<MensajeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
