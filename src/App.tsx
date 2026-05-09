import { useState, useCallback } from 'react';
import type { JobApplication, ColumnType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Board } from './components/Board/Board';
import { Stats } from './components/Stats/Stats';
import { SearchBar } from './components/SearchBar/SearchBar';
import { ApplicationModal } from './components/Modal/ApplicationModal';
import styles from './App.module.css';

function App() {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job-tracker-apps', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ColumnType>('toApply');

  const handleAdd = useCallback((status: ColumnType) => {
    setEditingApp(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((app: JobApplication) => {
    setEditingApp(app);
    setDefaultStatus(app.status);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback((app: JobApplication) => {
    setApplications((prev) => {
      const exists = prev.find((a) => a.id === app.id);
      if (exists) return prev.map((a) => (a.id === app.id ? app : a));
      return [...prev, app];
    });
    setModalOpen(false);
    setEditingApp(null);
  }, [setApplications]);

  const handleDelete = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setModalOpen(false);
    setEditingApp(null);
  }, [setApplications]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [applications]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (Array.isArray(data)) setApplications(data);
        } catch { /* ignore invalid file */ }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setApplications]);

  return (
    <div className={styles.app}>
      <div className={styles.topBar}>
        <div className={styles.titleSection}>
          <span className={styles.logo}>📋</span>
          <h1 className={styles.appTitle}>求职申请管理看板</h1>
        </div>
        <div className={styles.controls}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button className={styles.addGlobalBtn} onClick={() => handleAdd('inbox')}>+ 新增申请</button>
          <button className={styles.addGlobalBtn} onClick={handleExport}>导出</button>
          <button className={styles.addGlobalBtn} onClick={handleImport}>导入</button>
        </div>
      </div>
      <div className={styles.statsRow}>
        <Stats applications={applications} />
      </div>
      <Board
        applications={applications}
        searchQuery={searchQuery}
        onUpdate={setApplications}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(id) => { if (confirm('确定删除这条申请？')) handleDelete(id); }}
      />
      {modalOpen && (
        <ApplicationModal
          app={editingApp}
          defaultStatus={defaultStatus}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setModalOpen(false); setEditingApp(null); }}
        />
      )}
    </div>
  );
}

export default App;
