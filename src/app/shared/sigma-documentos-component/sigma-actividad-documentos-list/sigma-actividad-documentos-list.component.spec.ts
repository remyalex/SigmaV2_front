import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaActividadDocumentosListComponent } from './sigma-actividad-documentos-list.component';

describe('SigmaActividadDocumentosListComponent', () => {
  let component: SigmaActividadDocumentosListComponent;
  let fixture: ComponentFixture<SigmaActividadDocumentosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaActividadDocumentosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaActividadDocumentosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
