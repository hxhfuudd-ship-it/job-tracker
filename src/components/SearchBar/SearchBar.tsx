import styles from './SearchBar.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.input}
        type="text"
        placeholder="搜索公司或岗位..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
