import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Plant from '@/pages/Plant'
import Faces from '@/pages/Faces'
import RoutePage from '@/pages/Route'
import Family from '@/pages/Family'
import Navigation from '@/components/Navigation'
import { useGardenStore } from '@/store/gardenStore'

export default function App() {
  const fontSize = useGardenStore((s) => s.fontSize)

  return (
    <Router>
      <div className={`font-body font-size-${fontSize} min-h-screen pb-24`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plant" element={<Plant />} />
          <Route path="/faces" element={<Faces />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/family" element={<Family />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  )
}
