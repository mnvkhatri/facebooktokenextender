import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Facebook Token Manager',
  description: 'Exchange short-lived Facebook tokens for long-lived tokens',
}

const WatermarkComponent = () => {
  // Encoded watermark - made tamper-resistant
  const creator = Buffer.from('bW52a2hhdHJp', 'base64').toString('utf-8')
  const year = new Date().getFullYear()
  
  return (
    <div 
      className="pointer-events-none select-none opacity-75"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      data-watermark={creator}
    >
      <span className="text-xs text-gray-400">
        Made with ❤️ by <a href="https://github.com/mnvkhatri" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-semibold">mnvkhatri</a> © {year}
      </span>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">Facebook Token Manager</h1>
              <p className="text-xs md:text-sm text-gray-500">Exchange short-lived tokens for long-lived tokens safely</p>
            </div>
            <div className="text-xs text-gray-600">Secure · Minimal · Client-first</div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-600">
            <div>Your data is not stored by this app; tokens are exchanged and handled transiently for convenience.</div>
            <div className="mt-2 text-xs text-gray-500">Review the source before production use. This tool is provided as-is.</div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <WatermarkComponent />
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
