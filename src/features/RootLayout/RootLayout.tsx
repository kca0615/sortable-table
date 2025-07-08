import styles from "./RootLayout.module.css";
import Footer from "./Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles["app-layout"]} bg-background`}>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
