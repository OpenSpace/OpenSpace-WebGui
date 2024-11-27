export interface Milestone {
  date: string; // Date as an ISO8601 string
  name: string;
  description?: string;
  image?: string;
  link?: string;
  actions?: string[];
}

export interface Phase {
  name: string;
  description: string;
  actions: string[];
  timerange: { start: string; end: string }; // Dates as an ISO8601 string
  phases: Phase[];
  image: string;
  link: string;
  milestones: Milestone[];
  capturedtimes: string[];
}
