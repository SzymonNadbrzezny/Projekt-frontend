import styled from "styled-components";
import image from "@assets/profileTest.avif";
import { useContext, useState } from "react";
import StyledLink from "../Utils/StyledLink";
import { ApiClient, userContext } from "@/API/apiClient";
import Button from "../Utils/StyledButton";
import LoginModal from "../Modal/LoginModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoggedOutModal from "../Modal/LoggedOutModal";
const Body = styled.div<{ open?: boolean }>`
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  > a {
    align-self: stretch;
    height: 100%;
  }
`;
const UserNameDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  align-self: stretch;
  height: 100%;
  min-height: 50px;
  &&:hover {
    cursor: pointer;
    background-color: color-mix(in oklab, transparent, gray 20%);
  }
  span {
    font-weight: 600;
  }
  img {
    width: 24px;
    aspect-ratio: 1;
    border-radius: 100%;
    border: 2px solid ${({ theme }) => theme.colors.primary["200"]};
  }
`;
const Menu = styled.ul<{ open?: boolean }>`
  margin-left: 0;
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 0 0 10px 10px;
  padding-bottom: ${({ open }) => (open ? "10px" : "0")};
  z-index: 10;
  box-shadow: 0px 4px 4px 0px #cacae1;
  hr {
    width: 70%;
  }
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  height: 100%;
  align-self: stretch;
  &&:hover {
    cursor: pointer;
    background-color: color-mix(in oklab, transparent, gray 20%);
  }
  span {
    font-weight: 600;
  }
  img {
    width: 24px;
    aspect-ratio: 1;
    border-radius: 100%;
    border: 2px solid ${({ theme }) => theme.colors.primary["200"]};
  }
`;
function UserBox() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, login } = useContext(userContext);
  const [loggedOut, setLoggedOut] = useState(currentUser ? false : false);
  const path = useLocation();
  const navigate = useNavigate();
  // console.log(currentUser);
  return (
    <Body
      onMouseLeave={() => setIsOpen(false)}
      open={isOpen}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {currentUser ? (
        <>
          <UserNameDisplay>
            <span>{currentUser.name}</span>
            <img src={image} />
          </UserNameDisplay>
          <Menu open={isOpen}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            {currentUser?.permissions?.includes("admin") && (
              <MenuItem>
                <StyledLink
                  linkStyle="nav"
                  linkType="text"
                  to="/admin/dashboard"
                >
                  Admin Panel
                </StyledLink>
              </MenuItem>
            )}
            <hr />
            <MenuItem>
              <Button
                buttonStyle="text"
                onClick={() => {
                  ApiClient.logout()
                    .then((res) => {
                      console.log(res);
                      if (res.status == "ok") {
                        setLoggedOut(true);
                      }
                    })
                    .finally(() => {
                      login(null);
                      login(null);
                      path.pathname.includes("admin") && navigate("/");
                    });
                }}
              >
                Logout
              </Button>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <LoginModal />
      )}
      {loggedOut && <LoggedOutModal />}
    </Body>
  );
}

export default UserBox;
