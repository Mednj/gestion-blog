import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IBlogger } from 'app/entities/blogger/blogger.model';
import { BloggerService } from 'app/entities/blogger/service/blogger.service';
import { BlogService } from '../service/blog.service';
import { IBlog } from '../blog.model';
import { BlogFormService } from './blog-form.service';

import { BlogUpdateComponent } from './blog-update.component';

describe('Blog Management Update Component', () => {
  let comp: BlogUpdateComponent;
  let fixture: ComponentFixture<BlogUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blogFormService: BlogFormService;
  let blogService: BlogService;
  let bloggerService: BloggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BlogUpdateComponent],
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
      .overrideTemplate(BlogUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlogUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blogFormService = TestBed.inject(BlogFormService);
    blogService = TestBed.inject(BlogService);
    bloggerService = TestBed.inject(BloggerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Blogger query and add missing value', () => {
      const blog: IBlog = { id: 456 };
      const blogger: IBlogger = { id: 28845 };
      blog.blogger = blogger;

      const bloggerCollection: IBlogger[] = [{ id: 29548 }];
      jest.spyOn(bloggerService, 'query').mockReturnValue(of(new HttpResponse({ body: bloggerCollection })));
      const additionalBloggers = [blogger];
      const expectedCollection: IBlogger[] = [...additionalBloggers, ...bloggerCollection];
      jest.spyOn(bloggerService, 'addBloggerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blog });
      comp.ngOnInit();

      expect(bloggerService.query).toHaveBeenCalled();
      expect(bloggerService.addBloggerToCollectionIfMissing).toHaveBeenCalledWith(
        bloggerCollection,
        ...additionalBloggers.map(expect.objectContaining),
      );
      expect(comp.bloggersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const blog: IBlog = { id: 456 };
      const blogger: IBlogger = { id: 9552 };
      blog.blogger = blogger;

      activatedRoute.data = of({ blog });
      comp.ngOnInit();

      expect(comp.bloggersSharedCollection).toContain(blogger);
      expect(comp.blog).toEqual(blog);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlog>>();
      const blog = { id: 123 };
      jest.spyOn(blogFormService, 'getBlog').mockReturnValue(blog);
      jest.spyOn(blogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blog }));
      saveSubject.complete();

      // THEN
      expect(blogFormService.getBlog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(blogService.update).toHaveBeenCalledWith(expect.objectContaining(blog));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlog>>();
      const blog = { id: 123 };
      jest.spyOn(blogFormService, 'getBlog').mockReturnValue({ id: null });
      jest.spyOn(blogService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blog }));
      saveSubject.complete();

      // THEN
      expect(blogFormService.getBlog).toHaveBeenCalled();
      expect(blogService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlog>>();
      const blog = { id: 123 };
      jest.spyOn(blogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blogService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBlogger', () => {
      it('Should forward to bloggerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bloggerService, 'compareBlogger');
        comp.compareBlogger(entity, entity2);
        expect(bloggerService.compareBlogger).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
