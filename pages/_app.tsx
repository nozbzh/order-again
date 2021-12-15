import * as React from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
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
`;

const NavBar = styled.div`
  display: flex;
  box-shadow: lightgrey 0 1px 0 0;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
`;

const Login = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        Hi {session.user.name.split(" ")[0]} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
};

const TopBar = () => {
  return (
    <NavBar>
      <Link href="/" passHref>
        <Title>Order Again</Title>
      </Link>
      <Login />
    </NavBar>
  );
};

const NotesApp = ({ Component, pageProps: { session, ...rest } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <TopBar />
        <AppContainer>
          <Component {...rest} />
        </AppContainer>
        <Toaster />
      </Layout>
    </SessionProvider>
  );
};

export default NotesApp;
