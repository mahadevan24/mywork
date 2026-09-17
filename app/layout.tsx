import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevNotes | Work Notes & Task Pipeline",
  description: "Modern, high-performance developer work notes, standup tasks, and project tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('devnotes_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
