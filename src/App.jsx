import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/custom/hero';
import Header from './components/custom/header';
import CreateTrip from './create-trip';
import Viewtrip from './view-trip/[tripId]';
import My_Trips from './my-trips';

function App() {
  return (
    <Router>
      <Header />  
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/view-trip/:tripId" element={<Viewtrip />} />
        <Route path="/my-trips" element={<My_Trips />} />
      </Routes>
    </Router>
  );
}

export default App;