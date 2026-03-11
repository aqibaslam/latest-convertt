'use client'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image
          src="https://convertt.co/wp-content/uploads/2026/02/DARKLOGO-PNG.svg"
          alt="Convertt"
          width={140}
          height={32}
          unoptimized
        />
      </Link>
      <a
        href="https://audit.convertt.co/?cro_src=pdp-letecom/"
        className={styles.navCta}
      >
        Get Your FREE Audit Now!
        <Image
          src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-4.svg"
          alt=""
          width={32}
          height={32}
          unoptimized
        />
      </a>
    </nav>
  )
}
