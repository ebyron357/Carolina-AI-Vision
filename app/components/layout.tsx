import { ThemeProvider } from '@/components/theme-provider'
export const metadata = { robots: { index: false, follow: false } }
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
