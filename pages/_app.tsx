import * as React from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { AppProps } from "next/app";

import { Heading } from "components/StyledComponents";

import "styles/global.css";

const Layout = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled(Heading)`
  cursor: pointer !important;
  font-size: 3em;
  margin-top: 10px;
`;

const TopBar = () => {
  return (
    <Link href="/" passHref>
      <Title>GlassNotes</Title>
    </Link>
  );
};

const NotesApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <TopBar />
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
};

export default NotesApp;
