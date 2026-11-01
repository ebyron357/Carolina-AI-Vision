'use client'

import Link from 'next/link'
import Image from 'next/image'
const links = [
  ['/visibility', 'Free visibility check'],
  ['/studio', 'Website Studio'],
  ['/consulting', 'AI & automation'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]
export function Header() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Carolina Local AI home">
          <Image src="/logo/carolina.svg" alt="" width={44} height={44} />
          <span>
            CAROLINA <b>LOCAL AI</b>
            <small>LOCAL ROOTS. SMARTER GROWTH.</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={(event) =>
                  event.currentTarget
                    .closest('details')
                    ?.removeAttribute('open')
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </header>
    </>
  )
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="brand" href="/">
            CAROLINA LOCAL AI
          </Link>
          <p>
            Local roots. Practical technology.
            <br />
            Independent. Veteran-owned. North Carolina.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/studio">Website Studio</Link>
          <Link href="/consulting">Consulting & automation</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p>
          Get Found. Get Customers. Grow Smarter.
          <br />
          <small>No rankings, revenue, or AI recommendations guaranteed.</small>
        </p>
      </div>
    </footer>
  )
}
