import { IBlogger, NewBlogger } from './blogger.model';

export const sampleWithRequiredData: IBlogger = {
  id: 3925,
};

export const sampleWithPartialData: IBlogger = {
  id: 24180,
  username: 'tick forceful telephone',
  profileImage: '../fake-data/blob/hipster.png',
  profileImageContentType: 'unknown',
};

export const sampleWithFullData: IBlogger = {
  id: 14520,
  username: 'anesthesiology pace off',
  firstName: 'Ulises',
  lastName: 'Padberg',
  email: 'Sedrick_Koss@yahoo.com',
  profileImage: '../fake-data/blob/hipster.png',
  profileImageContentType: 'unknown',
};

export const sampleWithNewData: NewBlogger = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
