import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { BloggerService } from '../service/blogger.service';
import { IBlogger } from '../blogger.model';
import { BloggerFormService, BloggerFormGroup } from './blogger-form.service';

@Component({
  standalone: true,
  selector: 'jhi-blogger-update',
  templateUrl: './blogger-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BloggerUpdateComponent implements OnInit {
  isSaving = false;
  blogger: IBlogger | null = null;

  editForm: BloggerFormGroup = this.bloggerFormService.createBloggerFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected bloggerService: BloggerService,
    protected bloggerFormService: BloggerFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blogger }) => {
      this.blogger = blogger;
      if (blogger) {
        this.updateForm(blogger);
      }
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
    const blogger = this.bloggerFormService.getBlogger(this.editForm);
    if (blogger.id !== null) {
      this.subscribeToSaveResponse(this.bloggerService.update(blogger));
    } else {
      this.subscribeToSaveResponse(this.bloggerService.create(blogger));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlogger>>): void {
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

  protected updateForm(blogger: IBlogger): void {
    this.blogger = blogger;
    this.bloggerFormService.resetForm(this.editForm, blogger);
  }
}
