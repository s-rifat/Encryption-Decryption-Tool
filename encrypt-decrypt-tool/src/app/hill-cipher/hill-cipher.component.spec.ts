import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HillCipherComponent } from './hill-cipher.component';

describe('HillCipherComponent', () => {
  let component: HillCipherComponent;
  let fixture: ComponentFixture<HillCipherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HillCipherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HillCipherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
