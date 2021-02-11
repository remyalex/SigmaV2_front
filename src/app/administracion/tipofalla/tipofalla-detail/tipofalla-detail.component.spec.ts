import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipofallaDetailComponent } from './tipofalla-detail.component';

describe('TipofallaDetailComponent', () => {
  let component: TipofallaDetailComponent;
  let fixture: ComponentFixture<TipofallaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipofallaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipofallaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
