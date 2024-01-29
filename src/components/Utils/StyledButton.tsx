import { ComponentProps } from "react";
import styled, { css } from "styled-components";

type ButtonStyles =
  | "primary"
  | "secondary"
  | "tertiary"
  | "nav"
  | "text"
  | "danger";
type ButtonProps = ComponentProps<"button"> & {
  buttonStyle?: ButtonStyles;
  outlined?: boolean;
};
type StyleButtonProps = ComponentProps<"button"> & {
  $buttonStyle?: ButtonStyles;
  $outlined?: boolean;
};
const StyledButton = styled.button<StyleButtonProps>`
  font: inherit;

  --hover-background-color: var(--background-color);
  ${({ $buttonStyle = "primary" }) => colorHandler($buttonStyle)}
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  padding: 10px;
  height: 100%;
  border: none;
  background-color: var(--background-color);
  color: var(--text-color);
  ${({ $buttonStyle }) => {
    if ($buttonStyle == "text") {
      return css`
        background: transparent;
        border: none;
        color: var(--text-color);
        padding: 0;
      `;
    }
  }}
  ${({ $outlined }) =>
    $outlined &&
    css`
      background: transparent;
      border: 1px solid var(--background-color);
      color: var(--background-color);
    `};
  &:hover {
    text-decoration: none;
    color: var(--hover-text-color);
    background: var(--hover-background-color);
    transition: 0.3s ease-out;
    ${({ $buttonStyle }) => {
      if ($buttonStyle == "text") {
        return css`
          background: transparent;
          color: var(--text-color);
          text-decoration: underline;
        `;
      }
    }}
  }
`;

function Button({
  children,
  buttonStyle = "primary",
  onClick,
  outlined,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $buttonStyle={buttonStyle}
      $outlined={outlined}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
function colorHandler(style: string) {
  switch (style) {
    case "primary":
      return css`
        --text-color: ${({ theme }) => theme.colors.secondary["400"]};
        --background-color: ${({ theme }) => theme.colors.primary["500"]};
        --hover-text-color: ${({ theme }) => theme.colors.secondary["600"]};
      `;
    case "secondary":
      return css`
        --text-color: ${({ theme }) => theme.colors.primary["800"]};
        --background-color: transparent;
        --hover-text-color: ${({ theme }) => theme.colors.primary["500"]};
      `;
    case "tertiary":
      return css`
        --text-color: ${({ theme }) => theme.colors.secondary["900"]};
        --background-color: transparent;
        --hover-text-color: ${({ theme }) => theme.colors.secondary["500"]};
      `;
    case "danger":
      return css`
        --text-color: color-mix(in oklab, white, #de4b4b 50%);
        --background-color: #a43b3b;
        --hover-text-color: color-mix(in oklab, white, #de4b4b 30%);
        --hover-background-color: color-mix(in oklab, #de4b4b, #a43b3b 60%);
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
