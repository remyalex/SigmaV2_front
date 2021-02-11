import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialListComponent } from './historial-list.component';

describe('HistorialListComponent', () => {
  let component: HistorialListComponent;
  let fixture: ComponentFixture<HistorialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
