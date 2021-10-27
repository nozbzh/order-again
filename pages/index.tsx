import * as React from "react";
import styled from "styled-components";
import Link from "next/link";

import NoteList from "components/NoteList";
import { Heading, Button } from "components/StyledComponents";

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
        <Heading>My Notes</Heading>
        <Link href="/notes/create" passHref>
          <Button data-testid="create-note-button">Create New Note</Button>
        </Link>
      </InnerContainer>
      <InnerContainer>
        <NoteList />
      </InnerContainer>
    </Container>
  );
}
