import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeAdminComponent } from './mensaje-admin.component';

describe('MensajeAdminComponent', () => {
  let component: MensajeAdminComponent;
  let fixture: ComponentFixture<MensajeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
