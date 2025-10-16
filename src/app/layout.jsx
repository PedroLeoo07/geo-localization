import "./globals.css";

export const metadata = {
  title: "Geolocalização e Mapas",
  description: "Sistema de geolocalização e rotas com mapas interativos",
  icons: {
    icon: "/globo.png",
    shortcut: "/globo.png",
    apple: "/globo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}