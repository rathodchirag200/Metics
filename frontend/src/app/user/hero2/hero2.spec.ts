import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hero2 } from './hero2';

describe('Hero2', () => {
  let component: Hero2;
  let fixture: ComponentFixture<Hero2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hero2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
