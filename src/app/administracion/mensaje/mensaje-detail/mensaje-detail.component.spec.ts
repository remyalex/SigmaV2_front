import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDetailComponent } from './mensaje-detail.component';

describe('MensajeDetailComponent', () => {
  let component: MensajeDetailComponent;
  let fixture: ComponentFixture<MensajeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
