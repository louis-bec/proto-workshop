import * as React from 'react';
import { Title2, Button, Card, Body1, makeStyles, shorthands } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f5f6f8'
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    ...shorthands.padding('12px', '24px'),
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  brand: {
    fontWeight: 600,
    fontSize: 18
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  content: {
    flex: 1,
    ...shorthands.padding('32px'),
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    marginTop: '16px'
  },
  card: {
    width: '240px',
    cursor: 'pointer',
    transition: 'box-shadow .2s, transform .2s',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      transform: 'translateY(-2px)'
    }
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: 8
  },
  emoji: {
    fontSize: 24,
    lineHeight: 1
  }
});

export default function HomePage() {
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const styles = useStyles();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setMe(data))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  const features = [
    {
      key: 'worklist',
      title: 'Worklist',
      icon: '🗂️',
      description: 'View and manage work items awaiting action.',
      path: '/worklist'
    },
    {
      key: 'task-group',
      title: 'Task Groups',
      icon: '🧩',
      description: 'Group related tasks for streamlined workflows.',
      path: '/task-group'
    }
  ];

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>Proto Workshop</div>
        <div className={styles.userInfo}>
          {loading ? <span>Loading user...</span> : me ? <span>Signed in as <strong>{me.username}</strong></span> : <span />}
          <Button appearance="secondary" size="small" onClick={logout}>Logout</Button>
        </div>
      </nav>
      <div className={styles.content}>
        <Title2>Home</Title2>
        <div className={styles.cardGrid}>
          {features.map(f => (
            <Card key={f.key} className={styles.card} onClick={() => navigate(f.path)}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.emoji} aria-hidden>{f.icon}</span>
                <strong>{f.title}</strong>
              </div>
              <Body1>{f.description}</Body1>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
