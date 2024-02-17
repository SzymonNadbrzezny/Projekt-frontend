import { InputHTMLAttributes, Ref, forwardRef, useId } from "react";
import styled, { css } from "styled-components";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: stretch;
  color: ${({ theme }) => theme.colors.primary["700"]};
`;
const Label = styled.label<{ $error?: boolean }>`
  font-size: 1rem;
  font-weight: bold;
  ${({ $error }) =>
    $error &&
    css`
      color: red;
    `}
`;
const Error = styled.span`
  color: red;
  font-size: 0.8rem;
`;
const SInput = styled.input<{ $error?: boolean }>`
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  font-size: 1rem;
  font-family: inherit;
  ${({ $error }) =>
    $error &&
    css`
      border-color: red;
      background-color: color-mix(in oklab, white 90%, red);
    `}
`;
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

function Input(
  { label, error, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  const id = useId();
  return (
    <Body>
      {label && (
        <Label $error={!!error} htmlFor={id}>
          {label}
        </Label>
      )}
      <SInput id={id} $error={!!error} {...props} ref={ref} />
      {error && <Error>{error}</Error>}
    </Body>
  );
}
const In = forwardRef(Input);
export default In;
