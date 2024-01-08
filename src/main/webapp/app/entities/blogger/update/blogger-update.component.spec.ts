import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BloggerService } from '../service/blogger.service';
import { IBlogger } from '../blogger.model';
import { BloggerFormService } from './blogger-form.service';

import { BloggerUpdateComponent } from './blogger-update.component';

describe('Blogger Management Update Component', () => {
  let comp: BloggerUpdateComponent;
  let fixture: ComponentFixture<BloggerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bloggerFormService: BloggerFormService;
  let bloggerService: BloggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BloggerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BloggerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BloggerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bloggerFormService = TestBed.inject(BloggerFormService);
    bloggerService = TestBed.inject(BloggerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const blogger: IBlogger = { id: 456 };

      activatedRoute.data = of({ blogger });
      comp.ngOnInit();

      expect(comp.blogger).toEqual(blogger);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlogger>>();
      const blogger = { id: 123 };
      jest.spyOn(bloggerFormService, 'getBlogger').mockReturnValue(blogger);
      jest.spyOn(bloggerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogger });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blogger }));
      saveSubject.complete();

      // THEN
      expect(bloggerFormService.getBlogger).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bloggerService.update).toHaveBeenCalledWith(expect.objectContaining(blogger));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlogger>>();
      const blogger = { id: 123 };
      jest.spyOn(bloggerFormService, 'getBlogger').mockReturnValue({ id: null });
      jest.spyOn(bloggerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogger: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blogger }));
      saveSubject.complete();

      // THEN
      expect(bloggerFormService.getBlogger).toHaveBeenCalled();
      expect(bloggerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlogger>>();
      const blogger = { id: 123 };
      jest.spyOn(bloggerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogger });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bloggerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
