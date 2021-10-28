import * as React from "react";
import styled from "styled-components";
import Link from "next/link";

import NoteList from "components/NoteList";
import { Heading, Button, AppContainer } from "components/StyledComponents";

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CreateButton = styled(Button)`
  height: 3em;
`;

export default function Home() {
  return (
    <AppContainer>
      <InnerContainer>
        <Heading>My Notes</Heading>
        <Link href="/notes/create" passHref>
          <Button height="3em" data-testid="create-note-button">
            Create New Note
          </Button>
        </Link>
      </InnerContainer>
      <NoteList />
    </AppContainer>
  );
}
