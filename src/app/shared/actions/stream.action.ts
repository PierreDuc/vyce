import { StreamConnectionData } from '../states/stream.state';

export class StartListenStream {
  static readonly type = '[STREAM] Listen to possible stream requests';
}

export class StopListenStream {
  static readonly type = '[STREAM] Stop listening to possible stream requests';
}

export class AddMediaStream {
  static readonly type = '[STREAM] Add media stream to stream list';

  constructor(readonly connection: StreamConnectionData, readonly stream: MediaStream | null) {}
}

export class StartStream {
  static readonly type = '[STREAM] Start the streaming connection';

  constructor(readonly connection: StreamConnectionData) {}
}

export class RemoveStream {
  static readonly type = '[STREAM] Stop the streaming connection';

  constructor(readonly connection: StreamConnectionData) {}
}
