import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMezclaInsumosEditComponent } from './registro-mezcla-insumos-edit.component';

describe('RegistroMezclaInsumosEditComponent', () => {
  let component: RegistroMezclaInsumosEditComponent;
  let fixture: ComponentFixture<RegistroMezclaInsumosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroMezclaInsumosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMezclaInsumosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
