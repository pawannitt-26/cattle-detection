import './globals.css';

export const metadata = {
  title: 'CropGuardian - AI Farmer Assistant',
  description: 'Detect cattle and pests in real-time with AI.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
