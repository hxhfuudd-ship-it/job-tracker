import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { JobApplication, ColumnType } from '../../types';
import { COLUMNS, INBOX_COLUMN } from '../../constants';
import { Column } from '../Column/Column';
import { Card } from '../Card/Card';
import styles from './Board.module.css';

const ALL_COLUMNS = [...COLUMNS, INBOX_COLUMN];

interface Props {
  applications: JobApplication[];
  searchQuery: string;
  onUpdate: (apps: JobApplication[]) => void;
  onAdd: (status: ColumnType) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

export function Board({ applications, searchQuery, onUpdate, onAdd, onEdit, onDelete }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return applications;
    const q = searchQuery.toLowerCase();
    return applications.filter(
      (a) => a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.notes.toLowerCase().includes(q)
    );
  }, [applications, searchQuery]);

  const columnAppsMap = useMemo(() => {
    const map: Record<string, JobApplication[]> = {};
    for (const col of ALL_COLUMNS) map[col.id] = [];
    for (const app of filtered) {
      if (map[app.status]) map[app.status].push(app);
    }
    return map;
  }, [filtered]);

  const findContainer = (id: string): ColumnType | undefined => {
    if (ALL_COLUMNS.some((c) => c.id === id)) return id as ColumnType;
    return applications.find((a) => a.id === id)?.status;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    onUpdate(
      applications.map((a) =>
        a.id === active.id ? { ...a, status: overContainer, updatedAt: new Date().toISOString() } : a
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer && active.id !== over.id) {
      const columnApps = applications.filter((a) => a.status === activeContainer);
      const oldIndex = columnApps.findIndex((a) => a.id === active.id);
      const newIndex = columnApps.findIndex((a) => a.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(columnApps, oldIndex, newIndex);
        const otherApps = applications.filter((a) => a.status !== activeContainer);
        onUpdate([...otherApps, ...reordered]);
      }
    }
  };

  const activeApp = activeId ? applications.find((a) => a.id === activeId) : null;
  const activeColor = activeApp ? ALL_COLUMNS.find((c) => c.id === activeApp.status)?.color || '#e5e7eb' : '#e5e7eb';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.boardWrapper}>
        <div className={styles.board}>
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              applications={columnAppsMap[col.id] || []}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
        <div className={styles.inbox}>
          <Column
            id={INBOX_COLUMN.id}
            title={INBOX_COLUMN.title}
            color={INBOX_COLUMN.color}
            applications={columnAppsMap[INBOX_COLUMN.id] || []}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            className={styles.inboxColumn}
          />
        </div>
      </div>
      <DragOverlay>
        {activeApp ? (
          <div className={styles.dragOverlay}>
            <Card app={activeApp} color={activeColor} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
