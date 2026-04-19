import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { JobApplication, ColumnType } from '../../types';
import { Card } from '../Card/Card';
import styles from './Column.module.css';

interface Props {
  id: ColumnType;
  title: string;
  color: string;
  applications: JobApplication[];
  onAdd: (status: ColumnType) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function Column({ id, title, color, applications, onAdd, onEdit, onDelete, className }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`${styles.column} ${className || ''}`} style={{ '--column-color': color } as React.CSSProperties}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.dot} />
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.count}>{applications.length}</span>
        </div>
        <button className={styles.addBtn} onClick={() => onAdd(id)} title="添加申请">+</button>
      </div>
      <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={`${styles.cards} ${isOver ? styles.over : ''}`}>
          {applications.length === 0 ? (
            <div className={styles.empty}>拖拽卡片到此处</div>
          ) : (
            applications.map((app) => (
              <Card key={app.id} app={app} color={color} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
