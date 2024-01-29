import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

type $LinkTypes = "text" | "button";
type LinkProps = ComponentProps<typeof Link> & {
  linkStyle?: "primary" | "secondary" | "tertiary" | "nav";
  linkType?: $LinkTypes;
  outlined?: boolean;
};
type StyledLinkProps = ComponentProps<typeof Link> & {
  $linkStyle?: "primary" | "secondary" | "tertiary" | "nav";
  $linkType?: $LinkTypes;
  $outlined?: boolean;
};
const SLink = styled(Link)<StyledLinkProps>`
  --hover-background-color: var(--background-color);

  ${({ theme, ...p }) => {
    return colorHandler(p.$linkStyle || "primary");
  }}
  ${({ theme, ...p }) => {
    return typeHandler(p.$linkType || "text");
  }}
  color: var(--text-color);
  text-decoration: none;
  line-height: 1.3;
  border-radius: 5px;
  text-wrap: balance;
  ${({ $outlined }) =>
    $outlined &&
    css`
      background: transparent;
      border: 1px solid var(--background-color);
      color: var(--background-color);
    `};
  text-align: center;
  &:hover {
    ${({ $linkType }) =>
      $linkType == "button" &&
      css`
        text-decoration: none;
        color: var(--hover-text-color);
        background: var(--hover-background-color);
      `};

    transition: 0.3s ease-out;
  }
`;
function StyledLink({
  linkType = "text",
  linkStyle = "primary",
  outlined,
  ...props
}: LinkProps) {
  return (
    <SLink
      $linkStyle={linkStyle}
      $outlined={outlined}
      $linkType={linkType}
      {...props}
    />
  );
}

export default StyledLink;

export function colorHandler(style: string) {
  switch (style) {
    case "primary":
      return css`
        --text-color: ${({ theme }) => theme.colors.secondary["400"]};
        --background-color: ${({ theme }) => theme.colors.primary["500"]};
        --hover-text-color: ${({ theme }) => theme.colors.secondary["500"]};
      `;
    case "secondary":
      return css`
        --text-color: ${({ theme }) => theme.colors.primary["800"]};
        --background-color: transparent;
        --hover-text-color: ${({ theme }) => theme.colors.primary["500"]};
      `;
    case "tertiary":
      return css`
        --text-color: ${({ theme }) => theme.colors.primary["800"]};
        --background-color: transparent;
        --hover-text-color: ${({ theme }) => theme.colors.primary["500"]};
      `;
    case "nav":
      return css`
        display: flex;
        align-self: stretch;
        align-items: center;
        justify-content: center;
        max-height: 100%;
        border-radius: 0 !important;
        --text-color: ${({ theme }) => theme.colors.primary["800"]};
        --background-color: ${({ theme }) => theme.colors.secondary["400"]};
        --hover-text-color: ${({ theme }) => theme.colors.primary["500"]};
        --hover-background-color: ${({ theme }) =>
          theme.colors.secondary["100"]};
      `;
    default:
      return css`
        --text-color: ${({ theme }) => theme.colors.primary["800"]};
        --background-color: transparent;
        --hover-text-color: ${({ theme }) => theme.colors.primary["500"]};
      `;
  }
}

function typeHandler(type: $LinkTypes) {
  switch (type) {
    case "text":
      return css`
        padding: 0;
        border: none;
        background-color: transparent;
      `;
    case "button":
      return css`
        padding: 10px;
        border: none;
        background-color: var(--background-color);
      `;
  }
}
