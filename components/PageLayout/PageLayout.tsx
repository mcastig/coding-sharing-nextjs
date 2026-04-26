import Image from 'next/image'
import Header from '@/components/Header/Header'
import './PageLayout.css'

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f8fc]">
      {/* Hero background – arc lines on light section */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/Hero-Background-notecode.svg"
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Purple section – rendered in front of hero */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none page-gradient" />

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-12 sm:pb-24">
        <Header />
        {children}
      </div>
    </div>
  )
}
