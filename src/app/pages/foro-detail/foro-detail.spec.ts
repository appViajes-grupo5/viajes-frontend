import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForoDetailComponent } from './foro-detail';

describe('ForoDetailComponent', () => {
    let component: ForoDetailComponent;
    let fixture: ComponentFixture<ForoDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ForoDetailComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ForoDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
