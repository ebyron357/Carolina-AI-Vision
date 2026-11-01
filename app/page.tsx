import Link from 'next/link'
export const metadata = { alternates: { canonical: '/' } }
export default function Home() {
  return (
    <main id="main">
      <section className="hero wrap">
        <div>
          <p className="eyebrow">
            NORTH CAROLINA BUSINESSES. YOUR NEXT CHAPTER.
          </p>
          <h1>
            Get Found.
            <br />
            Get Customers.
            <br />
            <span>Grow Smarter.</span>
          </h1>
          <p className="lede">
            Your next customer is looking for you. Let’s make it easier to find
            you, trust you, and take the next step.
          </p>
          <p>
            Purpose-built websites, clearer AI visibility, and practical growth
            systems for local businesses.
          </p>
          <div className="actions">
            <Link className="button" href="/visibility">
              Get my free visibility check <span aria-hidden="true">→</span>
            </Link>
            <Link className="button secondary" href="/studio">
              Explore Website Studio
            </Link>
          </div>
          <p className="micro">
            No credit card. No audit required for website projects.
          </p>
        </div>
        <div
          className="hero-visual"
          aria-label="Our approach: a clear path from being found to following up"
        >
          <div className="visual-top">
            <span className="dot" /> THE LOCAL GROWTH PLAYBOOK{' '}
            <span>01 — 03</span>
          </div>
          <div className="visual-heading">
            Built for the way
            <br />
            <em>local business grows.</em>
          </div>
          <div className="path-row">
            <span>01</span>
            <div>
              <h2>Be the clear choice</h2>
              <p>Search-ready content. A credible presence.</p>
            </div>
            <b aria-hidden="true">→</b>
          </div>
          <div className="path-row">
            <span>02</span>
            <div>
              <h2>Turn interest into action</h2>
              <p>Useful websites. One obvious next step.</p>
            </div>
            <b aria-hidden="true">→</b>
          </div>
          <div className="path-row">
            <span>03</span>
            <div>
              <h2>Keep the conversation going</h2>
              <p>Thoughtful follow-up. Less busywork.</p>
            </div>
            <b aria-hidden="true">→</b>
          </div>
          <div className="visual-bottom">
            HUMAN STRATEGY. PRACTICAL AI.<span aria-hidden="true">+</span>
          </div>
        </div>
      </section>
      <div className="trust-strip">
        <div className="wrap">
          <span>Veteran-owned & independent</span>
          <span>North Carolina focused</span>
          <span>Evidence before promises</span>
          <span>No one-size-fits-all funnel</span>
        </div>
      </div>
      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">START WHERE YOU ARE</p>
            <h2>
              Three ways forward.
              <br />
              One local growth partner.
            </h2>
          </div>
          <p>
            You don’t need another complicated tech stack. You need the right
            next step for your business.
          </p>
        </div>
        <div className="cards three">
          <article className="service-card">
            <span className="number">01 / GET FOUND</span>
            <h3>Know where you stand.</h3>
            <p>
              Start with a free visibility check. Understand what we can
              establish today, what needs research, and where to focus next.
            </p>
            <ul>
              <li>Business presence intake</li>
              <li>Transparent evidence boundaries</li>
              <li>Human review, not a made-up score</li>
            </ul>
            <Link className="text-link" href="/visibility">
              Start your free check →
            </Link>
          </article>
          <article className="service-card featured">
            <span className="number">02 / GET CUSTOMERS</span>
            <h3>
              A website that works
              <br />
              as hard as you do.
            </h3>
            <p>
              A clear, fast, mobile-friendly home for your business. Explore
              industry concepts and choose the scope that fits.
            </p>
            <ul>
              <li>Purposeful design & clear calls to action</li>
              <li>Flexible project packages</li>
              <li>No paid audit prerequisite</li>
            </ul>
            <Link className="text-link" href="/studio">
              Step inside Website Studio →
            </Link>
          </article>
          <article className="service-card">
            <span className="number">03 / GROW SMARTER</span>
            <h3>
              Less friction.
              <br />
              More follow-through.
            </h3>
            <p>
              Find practical uses for AI and automation, from a focused strategy
              to connected lead-response workflows.
            </p>
            <ul>
              <li>AI Growth Blueprint</li>
              <li>Business Growth Systems</li>
              <li>Ongoing Growth Management</li>
            </ul>
            <Link className="text-link" href="/consulting">
              Find your next improvement →
            </Link>
          </article>
        </div>
      </section>
      <section className="light-section">
        <div className="wrap split">
          <div>
            <p className="eyebrow">BUILT ON CLARITY, NOT HYPE</p>
            <h2>
              Your business is local.
              <br />
              Your strategy should be, too.
            </h2>
          </div>
          <div>
            <p>
              Carolina Local AI is an independent, veteran-owned digital growth
              brand serving North Carolina, with a focus on Charlotte and
              Fayetteville.
            </p>
            <p>
              We explain the work, agree on a scope, and distinguish observed
              facts from recommendations. No invented results. No guaranteed
              rankings. No pressure to buy an audit before building your
              website.
            </p>
            <Link className="text-link" href="/about">
              Meet the approach →
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap cta">
        <p className="eyebrow">A CLEARER NEXT STEP</p>
        <h2>
          Start with your business.
          <br />
          Not with the technology.
        </h2>
        <Link className="button" href="/consulting">
          Let’s talk about your goals →
        </Link>
      </section>
    </main>
  )
}
