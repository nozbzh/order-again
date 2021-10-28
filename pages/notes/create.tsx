import * as React from "react";

import NoteForm from "components/NoteForm";
import { AppContainer } from "components/StyledComponents";

const CreateNote = (): JSX.Element => {
  return (
    <AppContainer>
      <NoteForm />
    </AppContainer>
  );
};

export default CreateNote;
