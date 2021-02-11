import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeCreateComponent } from './mensaje-create.component';

describe('MensajeCreateComponent', () => {
  let component: MensajeCreateComponent;
  let fixture: ComponentFixture<MensajeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
