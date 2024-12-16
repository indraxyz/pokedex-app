import { PropsWithChildren, ReactElement } from "react";
import { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import {
  DocumentHeadTags,
  documentGetInitialProps,
  DocumentHeadTagsProps,
} from "@mui/material-nextjs/v15-pagesRouter";
// or `v1X-pagesRouter` if you are using Next.js v1X

type Props = {
  emotionStyleTags: ReactElement<unknown>[];
};

export default function Document(
  props: PropsWithChildren<Props> & DocumentHeadTagsProps
) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
