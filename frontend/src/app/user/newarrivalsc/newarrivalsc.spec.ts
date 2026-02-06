import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newarrivalsc } from './newarrivalsc';

describe('Newarrivalsc', () => {
  let component: Newarrivalsc;
  let fixture: ComponentFixture<Newarrivalsc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newarrivalsc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Newarrivalsc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
