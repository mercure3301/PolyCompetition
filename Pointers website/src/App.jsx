import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import PointerSection from './components/PointerSection'
import ReferenceSection from './components/ReferenceSection'
import ComparisonSection from './components/ComparisonSection'
import Quiz from './components/Quiz'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <PointerSection />
      <ReferenceSection />
      <ComparisonSection />
      <Quiz />
      <Footer />
    </div>
  )
}

export default App


