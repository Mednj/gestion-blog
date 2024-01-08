import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBlog, NewBlog } from '../blog.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBlog for edit and NewBlogFormGroupInput for create.
 */
type BlogFormGroupInput = IBlog | PartialWithRequiredKeyOf<NewBlog>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBlog | NewBlog> = Omit<T, 'date'> & {
  date?: string | null;
};

type BlogFormRawValue = FormValueOf<IBlog>;

type NewBlogFormRawValue = FormValueOf<NewBlog>;

type BlogFormDefaults = Pick<NewBlog, 'id' | 'date'>;

type BlogFormGroupContent = {
  id: FormControl<BlogFormRawValue['id'] | NewBlog['id']>;
  title: FormControl<BlogFormRawValue['title']>;
  content: FormControl<BlogFormRawValue['content']>;
  date: FormControl<BlogFormRawValue['date']>;
  mainImage: FormControl<BlogFormRawValue['mainImage']>;
  mainImageContentType: FormControl<BlogFormRawValue['mainImageContentType']>;
  document: FormControl<BlogFormRawValue['document']>;
  documentContentType: FormControl<BlogFormRawValue['documentContentType']>;
  blogger: FormControl<BlogFormRawValue['blogger']>;
};

export type BlogFormGroup = FormGroup<BlogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BlogFormService {
  createBlogFormGroup(blog: BlogFormGroupInput = { id: null }): BlogFormGroup {
    const blogRawValue = this.convertBlogToBlogRawValue({
      ...this.getFormDefaults(),
      ...blog,
    });
    return new FormGroup<BlogFormGroupContent>({
      id: new FormControl(
        { value: blogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(blogRawValue.title),
      content: new FormControl(blogRawValue.content),
      date: new FormControl(blogRawValue.date),
      mainImage: new FormControl(blogRawValue.mainImage),
      mainImageContentType: new FormControl(blogRawValue.mainImageContentType),
      document: new FormControl(blogRawValue.document),
      documentContentType: new FormControl(blogRawValue.documentContentType),
      blogger: new FormControl(blogRawValue.blogger),
    });
  }

  getBlog(form: BlogFormGroup): IBlog | NewBlog {
    return this.convertBlogRawValueToBlog(form.getRawValue() as BlogFormRawValue | NewBlogFormRawValue);
  }

  resetForm(form: BlogFormGroup, blog: BlogFormGroupInput): void {
    const blogRawValue = this.convertBlogToBlogRawValue({ ...this.getFormDefaults(), ...blog });
    form.reset(
      {
        ...blogRawValue,
        id: { value: blogRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BlogFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertBlogRawValueToBlog(rawBlog: BlogFormRawValue | NewBlogFormRawValue): IBlog | NewBlog {
    return {
      ...rawBlog,
      date: dayjs(rawBlog.date, DATE_TIME_FORMAT),
    };
  }

  private convertBlogToBlogRawValue(
    blog: IBlog | (Partial<NewBlog> & BlogFormDefaults),
  ): BlogFormRawValue | PartialWithRequiredKeyOf<NewBlogFormRawValue> {
    return {
      ...blog,
      date: blog.date ? blog.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
