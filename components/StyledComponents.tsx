import styled from "styled-components";

export const Button = styled.button`
  cursor: pointer;
  border-width: 1px;
  border-style: solid;
  color: white;
  height: ${props => props.height || "auto"};
  border-color: ${props => (props.danger ? "crimson" : "cornflowerblue")};
  background-color: ${props => (props.danger ? "crimson" : "cornflowerblue")};
  padding: 0.5rem 1rem;
  margin: 0 0.1em;
`;

export const Flex = styled.div`
  display: flex;
`;

export const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2em auto;
  max-width: 800px;
`;

export const SubTitle = styled.h3``;
export const Heading = styled.h2``;
export const Body = styled.p``;
