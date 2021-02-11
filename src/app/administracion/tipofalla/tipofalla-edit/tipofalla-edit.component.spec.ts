import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipofallaEditComponent } from './tipofalla-edit.component';

describe('TipofallaEditComponent', () => {
  let component: TipofallaEditComponent;
  let fixture: ComponentFixture<TipofallaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipofallaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipofallaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
