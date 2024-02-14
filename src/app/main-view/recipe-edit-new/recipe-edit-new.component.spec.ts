import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeEditNewComponent } from './recipe-edit-new.component';

describe('RecipeEditNewComponent', () => {
  let component: RecipeEditNewComponent;
  let fixture: ComponentFixture<RecipeEditNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeEditNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeEditNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
