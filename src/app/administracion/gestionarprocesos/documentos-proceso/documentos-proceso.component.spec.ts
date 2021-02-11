import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosProcesoComponent } from './documentos-proceso.component';

describe('DocumentosProcesoComponent', () => {
  let component: DocumentosProcesoComponent;
  let fixture: ComponentFixture<DocumentosProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
