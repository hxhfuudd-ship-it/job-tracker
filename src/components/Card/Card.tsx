import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { JobApplication } from '../../types';
import styles from './Card.module.css';

interface Props {
  app: JobApplication;
  color: string;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

function getDeadlineStatus(deadline: string): 'normal' | 'warning' | 'expired' {
  if (!deadline) return 'normal';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  const diff = d.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0) return 'expired';
  if (days <= 3) return 'warning';
  return 'normal';
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function Card({ app, color, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: app.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--column-color': color,
  } as React.CSSProperties;

  const deadlineStatus = getDeadlineStatus(app.deadline);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className={styles.header}>
        <h4 className={styles.company}>{app.company}</h4>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit(app)} title="编辑">
            &#9998;
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(app.id)} title="删除">
            &times;
          </button>
        </div>
      </div>
      <p className={styles.position}>
        {app.position}
        {app.location && <span className={styles.location}> · {app.location}</span>}
      </p>
      <div className={styles.meta}>
        {app.deadline && (
          <span className={`${styles.deadline} ${deadlineStatus !== 'normal' ? styles[deadlineStatus] : ''}`}>
            {deadlineStatus === 'expired' ? '已过期 ' : deadlineStatus === 'warning' ? '即将到期 ' : ''}
            {formatDate(app.deadline)}
          </span>
        )}
        {app.url && (
          <a className={styles.link} href={app.url} target="_blank" rel="noopener noreferrer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            🔗 链接
          </a>
        )}
      </div>
      {app.jobDescription && (
        <ul className={styles.descList}>
          {app.jobDescription
            .split('\n')
            .map((l) => l.replace(/^[\d、.）)\s]+/, '').trim())
            .filter((l) => l.length > 0)
            .slice(0, 3)
            .map((line, i) => (
              <li key={i} className={styles.descItem}>
                {line.length > 25 ? line.slice(0, 25) + '...' : line}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
