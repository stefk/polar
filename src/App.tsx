import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import styled, { createGlobalStyle } from "styled-components";
import { compile } from "mathjs";
import { draw, isValidExpr } from "./lib";
import { HelpModal, InvalidInputModal } from "./Modal";

const unitsPerAxe = 8;

const showcase = [
  "y = 3",
  "y = x",
  "y = x/10",
  "y = 2sin(3x)",
  "y = sqrt(7cos(2x))",
  "y = abs(3sin(8x))",
  "y = abs(8cos(16x))",
  "y = x^(4/3)/200",
  "y = 3/x",
  "y = cos(x/3) + x/60",
  "y = log(x)",
  "y = 12/log(x)",
  "y = cos(x/3) + x/60 + tan(x)"
];

const GlobalStyle = createGlobalStyle`
  body {
    background-image: linear-gradient(
      to right,
      #88abff,
      #eaeaea
    );
  }
`;

const Title = styled.h1`
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 14px;
  color: white;
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
`;

const inputStyle = `
  margin: auto 3px;
  padding: 4px;
  border: 1px solid #88abff;
  border-radius: 2px;
  font-family: monospace;
  letter-spacing: 0.02rem;
  outline-color: blue;
`;

const buttonStyle = `
  ${inputStyle}
  padding-left: 7px;
  padding-right: 7px;
  border-color: white;
  background: #88abff;
  color: white;
  cursor: pointer;
`;

const HelpButton = styled.button`
  ${buttonStyle}
`;

const Form = styled.form`
  margin: 0;
`;

const FunctionInput = styled.input`
  ${inputStyle}
  width: 242px;
  text-align: center;
`;

const Submit = styled.button`
  ${buttonStyle}
`;

const Container = styled.div`
  text-align: center;
`;

const Canvas = styled.canvas`
  min-width: 42%;
  margin: 12px;
  border: solid #88abff 1px;
  background: white;
`;

export default function App() {
  const [expression, setExpression] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  const showcaseIntervalRef = useRef<number>();
  const showcaseIndexRef = useRef<number>(0);
  const cartesianCanvasRef = useRef<HTMLCanvasElement>(null);
  const polarCanvasRef = useRef<HTMLCanvasElement>(null);
  const polarCtxRef = useRef<CanvasRenderingContext2D| null>(null);
  const cartesianCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  function doDraw(expression: string) {
    draw(
      expression,
      cartesianCtxRef.current!,
      polarCtxRef.current!,
      unitsPerAxe
    );
  }

  function drawShowcase() {
    const index = showcaseIndexRef.current;
    setExpression(showcase[index]);
    doDraw(showcase[index]);
    showcaseIndexRef.current = index < showcase.length - 1
      ? (index + 1)
      : 0;
  }

  useEffect(() => {
    const cartesianCanvas = cartesianCanvasRef.current!;
    const polarCanvas = polarCanvasRef.current!;

    // adjust canvas size to viewport
    const computedStyle = getComputedStyle(cartesianCanvas);
    const width = computedStyle.getPropertyValue("width");
    const height = computedStyle.getPropertyValue("height");
    cartesianCanvas.width = polarCanvas.width = parseInt(width);
    cartesianCanvas.height = polarCanvas.height = parseInt(height);

    cartesianCtxRef.current = cartesianCanvas.getContext("2d");
    polarCtxRef.current = polarCanvas.getContext("2d");
    showcaseIntervalRef.current = setInterval(drawShowcase, 2500);

    drawShowcase();
  }, []);

  return (
    <>
      <GlobalStyle/>
      <Title>Polar</Title>
      <ControlBar>
        <HelpButton
          aria-label="Help"
          onClick={() => setIsHelpModalOpen(true)}
        >
          ?
        </HelpButton>
        <Form>
          <FunctionInput
            type="text"
            value={expression}
            autoCapitalize="none"
            autoCorrect="off"
            onChange={e => setExpression(e.target.value)}
            onFocus={() => clearInterval(showcaseIntervalRef.current)}
          />
          <Submit
            type="submit"
            onClick={e => {
              e.preventDefault();

              if (isValidExpr(expression)) {
                doDraw(expression);
              } else {
                setIsInputModalOpen(true);
              }
            }}
          >
            Draw
          </Submit>
        </Form>
      </ControlBar>
      <Container>
        <Canvas ref={cartesianCanvasRef} width="300" height="300"/>
        <Canvas ref={polarCanvasRef} width="300" height="300"/>
      </Container>
      <HelpModal
        isOpen={isHelpModalOpen}
        close={() => setIsHelpModalOpen(false)}
      />
      <InvalidInputModal
        isOpen={isInputModalOpen}
        close={() => setIsInputModalOpen(false)}
      />
    </>
  );
};
