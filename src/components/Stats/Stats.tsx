import type { JobApplication } from '../../types';
import { COLUMNS } from '../../constants';
import styles from './Stats.module.css';

interface Props {
  applications: JobApplication[];
}

export function Stats({ applications }: Props) {
  return (
    <div className={styles.stats}>
      <span className={styles.total}>共 {applications.length} 条</span>
      {COLUMNS.map((col) => {
        const count = applications.filter((a) => a.status === col.id).length;
        return (
          <div key={col.id} className={styles.stat}>
            <span className={styles.dot} style={{ background: col.color }} />
            <span>{col.title}</span>
            <span className={styles.num}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}
