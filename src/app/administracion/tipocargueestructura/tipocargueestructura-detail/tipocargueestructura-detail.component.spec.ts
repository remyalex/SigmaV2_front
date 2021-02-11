import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueestructuraDetailComponent } from './tipocargueestructura-detail.component';

describe('TipocargueestructuraDetailComponent', () => {
  let component: TipocargueestructuraDetailComponent;
  let fixture: ComponentFixture<TipocargueestructuraDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueestructuraDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueestructuraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
