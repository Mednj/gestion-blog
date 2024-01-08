import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../blogger.test-samples';

import { BloggerFormService } from './blogger-form.service';

describe('Blogger Form Service', () => {
  let service: BloggerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloggerFormService);
  });

  describe('Service methods', () => {
    describe('createBloggerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBloggerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            profileImage: expect.any(Object),
          }),
        );
      });

      it('passing IBlogger should create a new form with FormGroup', () => {
        const formGroup = service.createBloggerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            profileImage: expect.any(Object),
          }),
        );
      });
    });

    describe('getBlogger', () => {
      it('should return NewBlogger for default Blogger initial value', () => {
        const formGroup = service.createBloggerFormGroup(sampleWithNewData);

        const blogger = service.getBlogger(formGroup) as any;

        expect(blogger).toMatchObject(sampleWithNewData);
      });

      it('should return NewBlogger for empty Blogger initial value', () => {
        const formGroup = service.createBloggerFormGroup();

        const blogger = service.getBlogger(formGroup) as any;

        expect(blogger).toMatchObject({});
      });

      it('should return IBlogger', () => {
        const formGroup = service.createBloggerFormGroup(sampleWithRequiredData);

        const blogger = service.getBlogger(formGroup) as any;

        expect(blogger).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBlogger should not enable id FormControl', () => {
        const formGroup = service.createBloggerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBlogger should disable id FormControl', () => {
        const formGroup = service.createBloggerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
