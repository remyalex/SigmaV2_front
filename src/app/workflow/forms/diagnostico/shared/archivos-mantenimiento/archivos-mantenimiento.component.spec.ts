import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosMantenimientoComponent } from './archivos-mantenimiento.component';

describe('ArchivosMantenimientoComponent', () => {
  let component: ArchivosMantenimientoComponent;
  let fixture: ComponentFixture<ArchivosMantenimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivosMantenimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
