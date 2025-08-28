import * as React from 'react';
import { Button, Input, Card, Title3, makeStyles, shorthands, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f3f3f3',
  },
  card: {
    width: '350px',
    ...shorthands.padding('32px'),
    ...shorthands.margin('16px'),
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

export default function LoginPage() {
  const styles = useStyles();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [mode, setMode] = React.useState('login');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    }).then(async r => {
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }
      return r.json();
    }).then(() => {
      window.location.href = '/';
    }).catch(err => {
      setError(err.message);
    }).finally(() => setLoading(false));
  };

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <Title3>{mode === 'login' ? 'Login' : 'Register'}</Title3>
        <form className={styles.form} onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <Text role="alert" style={{ color: 'red' }}>{error}</Text>}
          <Button type="submit" appearance="primary" disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </Button>
        </form>
        <Button appearance="secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </Button>
      </Card>
    </div>
  );
}
