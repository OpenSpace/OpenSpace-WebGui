export enum DownloadType {
  Started = 0,
  Progress,
  Finished,
  Failed
}

export interface DownloadEvent {
  type: DownloadType;
  id: string;
  downloadedBytes: number;
  totalBytes?: number;
}
