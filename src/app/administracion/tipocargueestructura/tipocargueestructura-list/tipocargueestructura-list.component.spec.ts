import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueestructuraListComponent } from './tipocargueestructura-list.component';

describe('TipocargueestructuraListComponent', () => {
  let component: TipocargueestructuraListComponent;
  let fixture: ComponentFixture<TipocargueestructuraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueestructuraListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueestructuraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
