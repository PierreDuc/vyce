export namespace InputKind {
  export function includes(kind: string): boolean {
    return Object.values(InputKind).includes(kind);
  }
}

export enum InputKind {
  Video = 'videoinput',
  Audio = 'audioinput'
}
