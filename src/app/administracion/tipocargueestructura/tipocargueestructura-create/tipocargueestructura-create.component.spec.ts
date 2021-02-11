import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueestructuraCreateComponent } from './tipocargueestructura-create.component';

describe('TipocargueestructuraCreateComponent', () => {
  let component: TipocargueestructuraCreateComponent;
  let fixture: ComponentFixture<TipocargueestructuraCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueestructuraCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueestructuraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
