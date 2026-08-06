import { Navigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { Navbar } from '../features/home/components/Navbar'
import { HeroSection } from '../features/home/components/HeroSection'
import { MetricsBand } from '../features/home/components/MetricsBand'
import { PipelineSection } from '../features/home/components/PipelineSection'
import { ArchitectureSection } from '../features/home/components/ArchitectureSection'
import { WeatherBackground } from '../features/home/components/WeatherBackground'
import { PricingSection } from '../features/home/components/PricingSection'
import { Footer } from '../features/home/components/Footer'

export default function HomePage() {
  const { isAuthenticated, isLoading, role } = useAuth()

  if (!isLoading && isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden">
      {/* Weather & Radar Atmospheric Background */}
      <WeatherBackground />

      {/* Main Content Layout */}
      <Navbar />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <MetricsBand />
        <PipelineSection />
        <ArchitectureSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}