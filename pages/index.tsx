import * as React from "react";
import styled from "styled-components";
import Link from "next/link";

import NoteList from "../components/NoteList";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2em auto;
  max-width: 800px;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function Home() {
  return (
    <Container>
      <InnerContainer>
        <h1>My Notes</h1>
        <Link href="/notes/create">
          <button>Create New Note</button>
        </Link>
      </InnerContainer>
      <InnerContainer>
        <NoteList />
      </InnerContainer>
    </Container>
  );
}
