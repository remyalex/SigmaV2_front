import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMezclaInsumosDeleteComponent } from './registro-mezcla-insumos-delete.component';

describe('RegistroMezclaInsumosDeleteComponent', () => {
  let component: RegistroMezclaInsumosDeleteComponent;
  let fixture: ComponentFixture<RegistroMezclaInsumosDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroMezclaInsumosDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMezclaInsumosDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
