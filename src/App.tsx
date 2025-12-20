
import './App.css';
import { DniproMap, Header, Legend } from './components';

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <div className="map-container">
          <DniproMap />
        </div>
        <Legend />
      </div>
    </div>
  );
}
