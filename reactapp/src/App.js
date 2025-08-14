
import './App.css';
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";

import Edit from "./components/Edit";
import About from "./components/About";


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<About/>}/>
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="navigate" element={<Navigate to="/" />}/>
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
