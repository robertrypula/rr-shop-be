import { ReadStream } from 'fs';

export interface Settings {
  clientId: string;
  clientSecret: string;
  from: string;
  refreshToken: string;
  user: string;
}

export interface Attachment {
  cid: string;
  content: ReadStream;
  filename: string;
}
