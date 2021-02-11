import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FallasEditComponent } from './fallasEdit.component';

describe('FallasEditComponent', () => {
  let component: FallasEditComponent;
  let fixture: ComponentFixture<FallasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FallasEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FallasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
