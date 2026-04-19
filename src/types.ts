export type ColumnType = 'toApply' | 'applied' | 'writtenTest' | 'interviewing' | 'offer' | 'rejected' | 'inbox';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  deadline: string;
  status: ColumnType;
  url: string;
  jobDescription: string;
  requirements: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
