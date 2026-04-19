import type { ColumnType } from './types';

export interface ColumnConfig {
  id: ColumnType;
  title: string;
  color: string;
}

export const COLUMNS: ColumnConfig[] = [
  { id: 'toApply', title: '待投递', color: '#6b7280' },
  { id: 'applied', title: '已投递', color: '#3b82f6' },
  { id: 'writtenTest', title: '笔试', color: '#8b5cf6' },
  { id: 'interviewing', title: '面试中', color: '#f59e0b' },
  { id: 'offer', title: '已录用', color: '#10b981' },
  { id: 'rejected', title: '已拒绝', color: '#ef4444' },
];

export const INBOX_COLUMN: ColumnConfig = { id: 'inbox', title: '暂存区', color: '#6366f1' };
