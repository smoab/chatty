import './App.css';
import {Switch, Route} from 'react-router-dom'
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/chat'>
          <ChatPage />
        </Route>
        <Route exact path='/' >
          <HomePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
