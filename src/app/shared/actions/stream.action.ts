export class LoadStream {
  static readonly type = '[STREAM] Load the stream by id';

  constructor(readonly signalId: string | null, readonly streamId: string) {}
}

export class StartListenStream {
  static readonly type = '[STREAM] Listen to possible stream requests';
}

export class StopListenStream {
  static readonly type = '[STREAM] Stop listening to possible stream requests';
}

export class AddTrack {
  static readonly type = '[STREAM] Add track to stream list';

  constructor(readonly signalId: string, readonly streamId: string, readonly track: MediaStream | null) {}
}

export class StopStream {
  static readonly type = '[STREAM] Stop streaming from id';

  constructor(readonly signalId: string) {}
}

export class OpenStream {
  static readonly type = '[STREAM] Stream is ready to be opened';

  constructor(readonly streamId: string) {}
}
