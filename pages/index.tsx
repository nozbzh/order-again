import * as React from "react";
import styled from "styled-components";
import Link from "next/link";

import NoteList from "components/NoteList";
import { Heading, Button } from "components/StyledComponents";

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function Home() {
  return (
    <>
      <InnerContainer>
        <Heading>My Notes</Heading>
        <Link href="/notes/create" passHref>
          <Button height="3em" data-testid="create-note-button">
            Create New Note
          </Button>
        </Link>
      </InnerContainer>
      <NoteList />
    </>
  );
}
