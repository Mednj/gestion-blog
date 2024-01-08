import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 32469,
};

export const sampleWithPartialData: IComment = {
  id: 17806,
  date: dayjs('2024-01-07T05:30'),
};

export const sampleWithFullData: IComment = {
  id: 178,
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2024-01-07T14:01'),
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
