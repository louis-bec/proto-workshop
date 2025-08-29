import * as React from 'react';
import { Title2, Button, Card, Body1, Input, Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, DrawerFooter, makeStyles, shorthands } from '@fluentui/react-components';
import { apiFetch } from '../apiClient';

const STATUSES = [
  { key: 'draft', label: 'Draft' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

const useStyles = makeStyles({
  wrapper: { padding: 24 },
  opBar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  board: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  column: { flex: 1, minWidth: 260, background: '#f5f6f8', ...shorthands.padding('12px'), borderRadius: 8 },
  colHeader: { fontWeight: 600, marginBottom: 12 },
  card: { marginBottom: 12, cursor: 'grab', userSelect: 'none' },
  empty: { fontStyle: 'italic', color: '#6b6b6b' },
  dragOver: { outline: '2px dashed #2563eb', outlineOffset: 2 }
});

export default function WorklistPage() {
  const styles = useStyles();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [draggingId, setDraggingId] = React.useState(null);
  const [dragOverStatus, setDragOverStatus] = React.useState(null);
  const [error, setError] = React.useState(null);

  const grouped = React.useMemo(() => {
    const g = { draft: [], in_progress: [], done: [] };
    for (const it of items) g[it.status]?.push(it);
    return g;
  }, [items]);

  const fetchData = React.useCallback(() => {
    setError(null);
    apiFetch('/api/worklists')
      .then(data => setItems(data))
      .catch(e => { console.error(e); setError(e.message); })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const createWorklist = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    apiFetch('/api/worklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })
      .then(w => { setItems(prev => [w, ...prev]); setOpen(false); setNewName(''); setError(null); })
      .catch(e => { console.error(e); setError(e.message); })
      .finally(() => setSubmitting(false));
  };

  const updateItem = (id, patch) => {
    apiFetch(`/api/worklists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    })
      .then(updated => { setItems(prev => prev.map(i => i.id === id ? updated : i)); setError(null); })
      .catch(e => { console.error(e); setError(e.message); });
  };

  // Drag events
  const onDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  };
  const onDragEnd = () => {
    setDraggingId(null);
    setDragOverStatus(null);
  };
  const onDragOverColumn = (e, status) => {
    e.preventDefault();
    setDragOverStatus(status);
  };
  const onDropColumn = (e, status) => {
    e.preventDefault();
    if (draggingId != null) {
      const item = items.find(i => i.id === draggingId);
      if (item && item.status !== status) updateItem(draggingId, { status });
    }
    setDragOverStatus(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.opBar}>
        <Title2 style={{ flex: 1 }}>Worklist</Title2>
  <Button appearance="primary" onClick={() => setOpen(true)}>New Worklist</Button>
  {error && <span style={{ color: 'red', fontSize: 12, maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={error}>{error}</span>}
        <Drawer position="end" open={open} onOpenChange={(_, d) => setOpen(d.open)}>
          <DrawerHeader>
            <DrawerHeaderTitle
              action={<Button appearance="subtle" onClick={() => setOpen(false)}>Close</Button>}
            >Create Worklist</DrawerHeaderTitle>
          </DrawerHeader>
            <form onSubmit={createWorklist} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <DrawerBody>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span>Name</span>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} required />
                </label>
              </DrawerBody>
              <DrawerFooter>
                <Button appearance="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button appearance="primary" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</Button>
              </DrawerFooter>
            </form>
        </Drawer>
      </div>
      <div className={styles.board}>
        {STATUSES.map(s => (
          <div key={s.key}
               className={styles.column + (dragOverStatus === s.key ? ' ' + styles.dragOver : '')}
               onDragOver={e => onDragOverColumn(e, s.key)}
               onDrop={e => onDropColumn(e, s.key)}>
            <div className={styles.colHeader}>{s.label}</div>
            {loading && <Body1>Loading...</Body1>}
            {!loading && grouped[s.key].length === 0 && <div className={styles.empty}>No items</div>}
            {grouped[s.key].map(item => (
              <Card
                key={item.id}
                className={styles.card}
                draggable
                onDragStart={e => onDragStart(e, item.id)}
                onDragEnd={onDragEnd}
              >
                <Body1>{item.name}</Body1>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
