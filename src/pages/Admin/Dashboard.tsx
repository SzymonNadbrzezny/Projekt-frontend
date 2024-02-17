import StyledLink from "@/components/Utils/StyledLink";
import { useState } from "react";
import styled from "styled-components";
import UserList from "./UserList";
import NewPost from "../Posts/NewPost";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex: 1;
`;
const StyledButton = styled.button`
  border: none;
  background-color: ${({ theme }) => theme.colors.primary["500"]};
  color: ${({ theme }) => theme.colors.secondary["300"]};
  font-weight: 600;
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s ease-out;
  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary["300"]};
    color: ${({ theme }) => theme.colors.primary["700"]};
  }
  &:not(:disabled):hover {
    background-color: ${({ theme }) => theme.colors.primary["600"]};
    transition: 0.3s ease-in;
  }
`;
function Dashboard() {
  const [Site, setSite] = useState(null);
  return (
    <Body>
      <Row>
        <StyledButton onClick={() => setSite((v) => UserList)}>
          Użytkownicy
        </StyledButton>
        <StyledButton onClick={() => setSite((v) => NewPost)}>
          Posty
        </StyledButton>
        <StyledLink to="../planner" linkType="button">
          Planer
        </StyledLink>
      </Row>
      {Site && <Site />}
    </Body>
  );
}

export default Dashboard;
