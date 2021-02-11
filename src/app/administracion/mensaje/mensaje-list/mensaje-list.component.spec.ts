import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeListComponent } from './mensaje-list.component';

describe('MensajeListComponent', () => {
  let component: MensajeListComponent;
  let fixture: ComponentFixture<MensajeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
