import * as React from 'react';
import { Button, Input, Card, Title3, makeStyles, shorthands } from '@fluentui/react-components';

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

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    alert(`Logging in as ${username}`);
  };

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <Title3>Login</Title3>
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
          <Button type="submit" appearance="primary">Login</Button>
        </form>
      </Card>
    </div>
  );
}
