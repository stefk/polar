import React, { ReactNode } from "react";
import Modal from "react-modal";
import styled from "styled-components";

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(14,44,152,0.5)"
  },
  content: {
    bottom: "auto",
    width: "80%",
    maxWidth: "480px",
    margin: "0 auto",
    paddingBottom: "32px",
    fontFamily: "monospace",
    lineHeight: "20px"
  }
};

const Title = styled.h2`
  font-size: 20px;
  font-weight: normal;
  color: #1f1fa4;
  margin-bottom: 40px;
`;

const ErrorTitle = styled(Title)`
  color: #ba2547;
`;

const CloseIcon = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  font-size: 26px;
  color: #4356e4;
  cursor: pointer;
`;

const CloseButton = styled.button`
  display: block;
  margin: 32px auto 0;
  padding: 4px 7px;
  border: none;
  border-radius: 2px;
  background: #88abff;
  color: white;
  font-family: "monospace";
  cursor: pointer;
  outline-color: blue;
`;

const Expression = styled.code`
  display: block;
  text-align: center;
  margin: 16px;
  font-style: italic;
`;

interface BaseModalProps {
  label: string;
  isOpen: boolean;
  close: () => void;
  children: ReactNode[];
}

function BaseModal(
  { label, isOpen, close, children }: BaseModalProps
) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      contentLabel="Invalid input modal"
      style={modalStyle}
    >
      <CloseIcon onClick={close}>
        ×
      </CloseIcon>
      {children}
      <CloseButton onClick={close}>
        Close
      </CloseButton>
    </Modal>
  );
}

function SyntaxExplanation() {
  return (
    <>
      <p>
        The expression must be a real function of x
        following the syntax of <a href="https://mathjs.org"
        rel="noopener nofrerrer" target="_blank">Math.js</a>.
      </p>
      <p>
        Examples of such expressions are:
        <Expression>y = sin(x)</Expression>
        <Expression>y = x + 1</Expression>
        <Expression>y = x^2 * 2</Expression>
        <Expression>y = log(x)</Expression>
      </p>
      <p>
        The complete documentation can be found <a
        href="https://mathjs.org/docs/expressions/syntax.html"
        rel="noopener nofrerrer" target="_blank">here</a>.
      </p>
    </>
  );
}

interface ModalProps {
  isOpen: boolean;
  close: () => void;
}

export function InvalidInputModal(
  { isOpen, close }: ModalProps
) {
  return (
    <BaseModal
      isOpen={isOpen}
      close={close}
      label="Invalid input modal"
    >
      <ErrorTitle>Invalid expression</ErrorTitle>
      <SyntaxExplanation/>
    </BaseModal>
  );
}

export function HelpModal(
  { isOpen, close }: ModalProps
) {
  return (
    <BaseModal
      isOpen={isOpen}
      close={close}
      label="Help modal"
    >
      <Title>About</Title>
      <p>
        This app allows you to draw the graph of a
        function of a single real variable in both
        cartesian and <a href="https://en.wikipedia.org/wiki/Polar_coordinate_system"
        target="_blank" rel="noopener noreferrer">
        polar coordinates</a>. Just enter some
        expression and hit "Draw" to render it
        side-by-side in these two systems.
      </p>
      <SyntaxExplanation/>
    </BaseModal>
  );
}

