import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioConfirmComponent } from './usuario-confirm.component';

describe('UsuarioConfirmComponent', () => {
  let component: UsuarioConfirmComponent;
  let fixture: ComponentFixture<UsuarioConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
