import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDietComponent } from './gen-diet.component';

describe('GenDietComponent', () => {
  let component: GenDietComponent;
  let fixture: ComponentFixture<GenDietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenDietComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenDietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
