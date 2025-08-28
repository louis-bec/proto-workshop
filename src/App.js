
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client';
import { Button } from '@fluentui/react-components';


const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>My first Apollo + Fluent UI app 🚀</h2>
        <Button appearance="primary">Fluent UI Button</Button>
        <br />
        {loading && <p>Loading locations...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && data.locations && (
          <div>
            {data.locations.slice(0, 3).map(({ id, name, description, photo }) => (
              <div key={id} style={{ margin: '1em 0' }}>
                <h3>{name}</h3>
                <img src={photo} alt={name} width="200" />
                <p>{description}</p>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
