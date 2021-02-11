import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaBusquedaComponent } from './sigma-busqueda.component';

describe('SigmaBusquedaComponent', () => {
  let component: SigmaBusquedaComponent;
  let fixture: ComponentFixture<SigmaBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
