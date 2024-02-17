import styled from "styled-components";
import Button from "../Utils/StyledButton";
import Dialog from "./Dialog";
import cross from "@assets/cross.svg";
import { ReactElement, forwardRef } from "react";
const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  min-width: 300px;
  max-width: 60vw;
  isolation: isolate;
  z-index: 100;
`;
const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 3px solid ${({ theme }) => theme.colors.primary["200"]};
  span {
    font-weight: 600;
  }
  img {
    width: 16px;
    aspect-ratio: 1;
  }
`;
const ModalContent = styled.div``;
type TitledModalProps = {
  title: string;
  opener?: ReactElement;
  children: (props: {
    closeFunction?: () => void;
    submitFunction?: (value: boolean) => void;
  }) => React.ReactNode;
};

const TitledModal = forwardRef<HTMLDialogElement, TitledModalProps>(
  ({ title, opener = <Button>Open Modal</Button>, children }, ref) => {
    return (
      <Dialog ref={ref} opener={opener}>
        {(props) => {
          return (
            <ModalBody>
              <ModalHeader>
                <span>{title}</span>
                <Button buttonStyle="text" onClick={props.closeFunction}>
                  <img src={cross} />
                </Button>
              </ModalHeader>
              <ModalContent>
                {children({
                  closeFunction: props.closeFunction,
                  submitFunction: props.submitFunction,
                })}
              </ModalContent>
            </ModalBody>
          );
        }}
      </Dialog>
    );
  }
);
export default TitledModal;
