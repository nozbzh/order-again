import * as React from "react";
import styled from "styled-components";
import Link from "next/link";

import HomePage from "components/establishment/HomePage";
import { Heading, Button } from "components/StyledComponents";

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const establishmentType = "Restaurant";

export default function Home() {
  return (
    <>
      <InnerContainer>
        <Heading>{`${establishmentType}s`}</Heading>
        <Link href="/establishments/create" passHref>
          <Button height="3em" data-testid="create-establishment-button">
            {`Add New ${establishmentType}`}
          </Button>
        </Link>
      </InnerContainer>
      <HomePage establishmentType={establishmentType} />
    </>
  );
}
