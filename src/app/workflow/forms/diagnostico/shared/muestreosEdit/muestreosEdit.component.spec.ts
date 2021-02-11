import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuestreosEditComponent } from './muestreosEdit.component';

describe('MuestreosEditComponent', () => {
  let component: MuestreosEditComponent;
  let fixture: ComponentFixture<MuestreosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuestreosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuestreosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
