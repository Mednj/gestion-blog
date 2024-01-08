import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IBlogger } from 'app/entities/blogger/blogger.model';
import { BloggerService } from 'app/entities/blogger/service/blogger.service';
import { BlogService } from '../service/blog.service';
import { IBlog } from '../blog.model';
import { BlogFormService, BlogFormGroup } from './blog-form.service';

@Component({
  standalone: true,
  selector: 'jhi-blog-update',
  templateUrl: './blog-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BlogUpdateComponent implements OnInit {
  isSaving = false;
  blog: IBlog | null = null;

  bloggersSharedCollection: IBlogger[] = [];

  editForm: BlogFormGroup = this.blogFormService.createBlogFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected blogService: BlogService,
    protected blogFormService: BlogFormService,
    protected bloggerService: BloggerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareBlogger = (o1: IBlogger | null, o2: IBlogger | null): boolean => this.bloggerService.compareBlogger(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blog }) => {
      this.blog = blog;
      if (blog) {
        this.updateForm(blog);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('blogMicroApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blog = this.blogFormService.getBlog(this.editForm);
    if (blog.id !== null) {
      this.subscribeToSaveResponse(this.blogService.update(blog));
    } else {
      this.subscribeToSaveResponse(this.blogService.create(blog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(blog: IBlog): void {
    this.blog = blog;
    this.blogFormService.resetForm(this.editForm, blog);

    this.bloggersSharedCollection = this.bloggerService.addBloggerToCollectionIfMissing<IBlogger>(
      this.bloggersSharedCollection,
      blog.blogger,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bloggerService
      .query()
      .pipe(map((res: HttpResponse<IBlogger[]>) => res.body ?? []))
      .pipe(map((bloggers: IBlogger[]) => this.bloggerService.addBloggerToCollectionIfMissing<IBlogger>(bloggers, this.blog?.blogger)))
      .subscribe((bloggers: IBlogger[]) => (this.bloggersSharedCollection = bloggers));
  }
}
