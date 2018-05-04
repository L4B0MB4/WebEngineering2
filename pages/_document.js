import Document, { Head, Main, NextScript } from "next/document";
import Lux from "../components/Lux";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <style>{`body { margin: 0 } `}</style>
        </Head>
        <body>
          <Lux>
            <Main />
            <NextScript />
          </Lux>
        </body>
      </html>
    );
  }
}
