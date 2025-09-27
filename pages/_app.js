// pages/_app.js
import "../styles/global.css";  // import your global CSS

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
