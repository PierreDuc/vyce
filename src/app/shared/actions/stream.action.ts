export class LoadStream {
  static readonly type = '[STREAM] Load the stream by id';

  constructor(readonly streamId: string) {}
}

export class StartListenStream {
  static readonly type = '[STREAM] Listen to possible stream requests';
}

export class StopListenStream {
  static readonly type = '[STREAM] Stop listening to possible stream requests';
}
