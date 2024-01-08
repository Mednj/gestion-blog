import dayjs from 'dayjs/esm';

import { IBlog, NewBlog } from './blog.model';

export const sampleWithRequiredData: IBlog = {
  id: 4156,
};

export const sampleWithPartialData: IBlog = {
  id: 20741,
  content: '../fake-data/blob/hipster.txt',
  mainImage: '../fake-data/blob/hipster.png',
  mainImageContentType: 'unknown',
};

export const sampleWithFullData: IBlog = {
  id: 28400,
  title: 'hiccups above',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2024-01-07T08:15'),
  mainImage: '../fake-data/blob/hipster.png',
  mainImageContentType: 'unknown',
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
};

export const sampleWithNewData: NewBlog = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
