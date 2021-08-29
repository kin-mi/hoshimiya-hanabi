import './App.css';
import { FireButton } from './components/FireButton';
import { Firework } from './components/Firework';
import { FireworkProvider } from './hooks/FireWorkContext';

function App() {
  return (
    <div className='container'>
      <FireworkProvider>
        <Firework />
        <FireButton />
      </FireworkProvider>
    </div>
  );
}

export default App;
