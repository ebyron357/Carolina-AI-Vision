import { PageIntro } from '@/components/page-intro'
export const metadata = { title: 'About', alternates: { canonical: '/about' } }
export default function About() {
  return (
    <main id="main" className="wrap section prose">
      <PageIntro
        eyebrow="LOCAL ROOTS. CLEAR PRINCIPLES."
        title="Built for the businesses that build our communities."
      >
        <p>
          Carolina Local AI is an independent, veteran-owned digital growth
          services brand serving North Carolina.
        </p>
      </PageIntro>
      <h2>Independent by design.</h2>
      <p>
        Carolina Local AI is separate from ClientVerse. We focus on practical,
        clearly scoped digital growth services for local businesses.
      </p>
      <h2>Our approach</h2>
      <p>
        Understand the business. Look for evidence. Agree on a practical scope.
        Build useful websites and systems. Review what changes.
      </p>
      <h2>Our North Carolina focus</h2>
      <p>
        Charlotte, Fayetteville, and businesses across North Carolina. Our work
        starts with understanding your services, your customers, and the next
        step that matters to your business.
      </p>
      <h2>What we won’t promise</h2>
      <p>
        Guaranteed rankings, revenue, or recommendations from AI platforms.
        Outcomes depend on your market, competition, implementation, and
        third-party platforms.
      </p>
    </main>
  )
}
