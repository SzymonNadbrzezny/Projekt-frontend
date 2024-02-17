import { useCallback, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { ApiClient, userContext } from "../../API/apiClient";

import styled from "styled-components";
import logo from "../../assets/Sekret Piękna.svg";
import StyledLink from "../Utils/StyledLink";
import UserBox from "../User/UserBox";
import { User } from "@/API/types/user";
import { useMe } from "@/API/hooks/UserHooks";
import { set } from "zod";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100vh;
`;
const Nav = styled.nav`
  position: sticky;
  top: 0;
  isolation: isolate;
  z-index: 100;
  background: ${({ theme }) => theme.colors.light};
  display: flex;
  height: 50px;
  max-height: 50px;
  justify-content: space-between;
  box-shadow: 0px 4px 4px 0px #cacae1;
`;
const Main = styled.main`
  height: 100vh;
  flex: 1;
  padding: 40px;
  padding-bottom: 50px;
  overflow-y: auto;
  scrollbar-gutter: stable;
`;
const LogoContainer = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
`;
const Logo = styled.img`
  height: 100%;
  padding: 5px;
  object-fit: cover;
  object-position: center;
`;
const NavLinkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 2;

  @media screen and (width < 500px) {
    flex-direction: column;
    background-color: inherit;
    height: min-content;
    gap: 5px;
  }
`;
const NavLinkContainer = styled.div`
  display: flex;
  flex: 1;
  @media screen and (width < 500px) {
    flex-direction: column;
  }
`;
function TopBar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const login = useCallback((res: User | null) => {
    // if (res?.jti) sessionStorage.setItem("token", res.jti);
    console.log(res, "topbar");
    if (!res) sessionStorage.removeItem("token");
    setCurrentUser(res);
  }, []);
  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  );
  const u = useQuery({
    queryKey: ["me"],
    queryFn: () => ApiClient.me(),
    retry: (fC, error: AxiosError) => {
      return error?.response?.status === 401 ? false : true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    refetchInterval: (query) => {
      return query.isStale() && 1000 * 60 * 5;
    },
  });

  return (
    <userContext.Provider value={contextValue}>
      <Body>
        <Nav>
          <LogoContainer>
            <Logo src={logo} />
          </LogoContainer>
          <NavLinkWrapper>
            <NavLinkContainer>
              <StyledLink linkStyle="nav" linkType="button" to="/">
                Home
              </StyledLink>
              <StyledLink linkStyle="nav" linkType="button" to="/services">
                Usługi
              </StyledLink>
              <StyledLink linkStyle="nav" linkType="button" to="/posts">
                Artykuły
              </StyledLink>
            </NavLinkContainer>
            {u.isFetched && <UserBox />}
          </NavLinkWrapper>
        </Nav>
        <Main>
          <Outlet />
        </Main>
      </Body>
    </userContext.Provider>
  );
}

export default TopBar;
