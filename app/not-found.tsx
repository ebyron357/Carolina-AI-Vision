import Link from 'next/link'
export default function NotFound() {
  return (
    <main id="main" className="wrap section prose">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>Let’s get you back on track.</h1>
      <p>This page isn’t available.</p>
      <Link className="button" href="/">
        Back to home
      </Link>
    </main>
  )
}
