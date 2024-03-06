import Register from './Register'
import Login from './Login'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
      <main className="App">
        <BrowserRouter>
          <Register /> 
          <Login />
        </BrowserRouter>
       
      </main>
     );
}

export default App;
