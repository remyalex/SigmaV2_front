import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueestructuraEditComponent } from './tipocargueestructura-edit.component';

describe('TipocargueestructuraEditComponent', () => {
  let component: TipocargueestructuraEditComponent;
  let fixture: ComponentFixture<TipocargueestructuraEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueestructuraEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueestructuraEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
