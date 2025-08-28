import * as React from 'react';
import { Title2, Button } from '@fluentui/react-components';

export default function HomePage() {
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setMe(data));
  }, []);

  const logout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: 32 }}>
      <Title2>Home</Title2>
      {me && <p>Welcome, {me.username}</p>}
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
