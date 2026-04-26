import Image from 'next/image'
import './Header.css'

export default function Header() {
  return (
    <>
      <header className="mt-6 mb-6 sm:mt-8 sm:mb-10">
        <Image
          src="/NoteCodeLogo.svg"
          alt="NoteCode"
          width={111}
          height={20}
          priority
        />
      </header>

      <section className="text-center mb-6 sm:mb-8">
        <p className="font-semibold text-nc-dark header-tagline">
          Create &amp; Share
        </p>
        <h1 className="font-semibold text-nc-dark header-title">
          Your Code easily
        </h1>
      </section>
    </>
  )
}
