import styles from "./RootLayout.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles["app-layout"]} bg-background`}>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
