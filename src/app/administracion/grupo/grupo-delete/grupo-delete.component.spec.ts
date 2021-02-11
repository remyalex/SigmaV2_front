import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDeleteComponent } from './grupo-delete.component';

describe('GrupoDeleteComponent', () => {
  let component: GrupoDeleteComponent;
  let fixture: ComponentFixture<GrupoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
