import * as React from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

import "styles/global.css";

const Layout = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  cursor: pointer;
`;

const TopBar = () => {
  return (
    <Link href="/">
      <Title>NoNotes</Title>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

// TODO: type props
const NotesApp = ({ Component, pageProps }) => {
  return (
    <Layout>
      <TopBar />
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
};

export default NotesApp;
