import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBlogger } from '../blogger.model';
import { BloggerService } from '../service/blogger.service';

@Component({
  standalone: true,
  templateUrl: './blogger-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BloggerDeleteDialogComponent {
  blogger?: IBlogger;

  constructor(
    protected bloggerService: BloggerService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bloggerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
