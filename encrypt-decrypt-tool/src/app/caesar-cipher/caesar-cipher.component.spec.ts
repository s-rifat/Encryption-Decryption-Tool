import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaesarCipherComponent } from './caesar-cipher.component';

describe('CaesarCipherComponent', () => {
  let component: CaesarCipherComponent;
  let fixture: ComponentFixture<CaesarCipherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaesarCipherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaesarCipherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
