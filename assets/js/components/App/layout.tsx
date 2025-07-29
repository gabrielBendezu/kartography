import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className={styles.appLayout}>
    <header className={styles.header}>Kartography</header>
    <main className={styles.mainContent}>{children}</main>
  </div>
);

export default Layout;
