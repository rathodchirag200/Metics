import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newarrivals } from './newarrivals';

describe('Newarrivals', () => {
  let component: Newarrivals;
  let fixture: ComponentFixture<Newarrivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newarrivals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Newarrivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
