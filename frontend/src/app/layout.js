import { Poppins } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Work Hub",
  description: "Manange Business, Hire Talent, Collaborate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className}  antialiased`}
      >
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" />

          <AuthProvider>
            {children}
          </AuthProvider>
         </ThemeProvider>
      </body>
    </html>
  );
}
