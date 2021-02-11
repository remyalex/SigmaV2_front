import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueestructuraDeleteComponent } from './tipocargueestructura-delete.component';

describe('TipocargueestructuraDeleteComponent', () => {
  let component: TipocargueestructuraDeleteComponent;
  let fixture: ComponentFixture<TipocargueestructuraDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueestructuraDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueestructuraDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
