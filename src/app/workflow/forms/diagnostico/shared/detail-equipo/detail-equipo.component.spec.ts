import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEquipoComponent } from './detail-equipo.component';

describe('DetailEquipoComponent', () => {
  let component: DetailEquipoComponent;
  let fixture: ComponentFixture<DetailEquipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailEquipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
