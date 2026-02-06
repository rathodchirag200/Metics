import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dresses } from './dresses';

describe('Dresses', () => {
  let component: Dresses;
  let fixture: ComponentFixture<Dresses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dresses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dresses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
