import * as React from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { AppProps } from "next/app";

import { Heading } from "components/StyledComponents";

import "styles/global.css";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2em auto;
  max-width: 800px;
`;

const Layout = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled(Heading)`
  cursor: pointer !important;
  font-size: 3em;
  margin-top: 10px;
  padding-bottom: 1rem;
  padding-left: 10px;
  box-shadow: lightgrey 0 1px 0 0;
`;

const TopBar = () => {
  return (
    <Link href="/" passHref>
      <Title>SimpleNotes</Title>
    </Link>
  );
};

const NotesApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <TopBar />
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
      <Toaster />
    </Layout>
  );
};

export default NotesApp;
