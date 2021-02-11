import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuestreosComponent } from './muestreos.component';

describe('MuestreosComponent', () => {
  let component: MuestreosComponent;
  let fixture: ComponentFixture<MuestreosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuestreosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuestreosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
