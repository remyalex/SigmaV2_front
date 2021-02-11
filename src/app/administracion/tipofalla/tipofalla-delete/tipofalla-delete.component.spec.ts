import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipofallaDeleteComponent } from './tipofalla-delete.component';

describe('TipofallaDeleteComponent', () => {
  let component: TipofallaDeleteComponent;
  let fixture: ComponentFixture<TipofallaDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipofallaDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipofallaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
