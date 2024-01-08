import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBlogger, NewBlogger } from '../blogger.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBlogger for edit and NewBloggerFormGroupInput for create.
 */
type BloggerFormGroupInput = IBlogger | PartialWithRequiredKeyOf<NewBlogger>;

type BloggerFormDefaults = Pick<NewBlogger, 'id'>;

type BloggerFormGroupContent = {
  id: FormControl<IBlogger['id'] | NewBlogger['id']>;
  username: FormControl<IBlogger['username']>;
  firstName: FormControl<IBlogger['firstName']>;
  lastName: FormControl<IBlogger['lastName']>;
  email: FormControl<IBlogger['email']>;
  profileImage: FormControl<IBlogger['profileImage']>;
  profileImageContentType: FormControl<IBlogger['profileImageContentType']>;
};

export type BloggerFormGroup = FormGroup<BloggerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BloggerFormService {
  createBloggerFormGroup(blogger: BloggerFormGroupInput = { id: null }): BloggerFormGroup {
    const bloggerRawValue = {
      ...this.getFormDefaults(),
      ...blogger,
    };
    return new FormGroup<BloggerFormGroupContent>({
      id: new FormControl(
        { value: bloggerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      username: new FormControl(bloggerRawValue.username),
      firstName: new FormControl(bloggerRawValue.firstName),
      lastName: new FormControl(bloggerRawValue.lastName),
      email: new FormControl(bloggerRawValue.email),
      profileImage: new FormControl(bloggerRawValue.profileImage),
      profileImageContentType: new FormControl(bloggerRawValue.profileImageContentType),
    });
  }

  getBlogger(form: BloggerFormGroup): IBlogger | NewBlogger {
    return form.getRawValue() as IBlogger | NewBlogger;
  }

  resetForm(form: BloggerFormGroup, blogger: BloggerFormGroupInput): void {
    const bloggerRawValue = { ...this.getFormDefaults(), ...blogger };
    form.reset(
      {
        ...bloggerRawValue,
        id: { value: bloggerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BloggerFormDefaults {
    return {
      id: null,
    };
  }
}
