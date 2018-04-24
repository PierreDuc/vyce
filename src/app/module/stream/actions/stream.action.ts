export class LoadStream {
  static readonly type = '[AUTH] Load the stream by id';

  constructor(readonly streamId: string) {}
}
