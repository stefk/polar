import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { compile } from "mathjs";
import { draw } from "./lib";

const unitsPerAxe = 8;

const showcase = [
  "3",
  "x",
  "x/10",
  "2sin(3x)",
  "sqrt(7cos(2x))",
  "abs(3sin(8x))",
  "abs(8cos(16x))",
  "x^(4/3)/200",
  "3/x",
  "cos(x/3) + x/60",
  "log(x)",
  "12/log(x)",
  "cos(x/3) + x/60 + tan(x)"
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

const Form = styled.form`
  display: block;
  margin: 20px;
  text-align: center;
`;

const inputStyle = `
  padding: 4px;
  border: 1px solid #88abff;
  border-radius: 2px;
  font-family: monospace;
  letter-spacing: 0.02rem;
  outline-color: blue;
`;

const FunctionInput = styled.input`
  ${inputStyle}
  margin-right: 4px;
`;

const Submit = styled.button`
  ${inputStyle}
  border-color: white;
  background: #88abff;
  color: white;
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
  const showcaseIntervalRef = useRef(null);
  const showcaseIndexRef = useRef(0);
  const cartesianCanvasRef = useRef(null);
  const cartesianCtxRef = useRef(null);
  const polarCanvasRef = useRef(null);
  const polarCtxRef = useRef(null);

  function doDraw(expression) {
    draw(
      expression,
      cartesianCtxRef.current,
      polarCtxRef.current,
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
    const cartesianCanvas = cartesianCanvasRef.current;
    const polarCanvas = polarCanvasRef.current;

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
      <Form>
        <FunctionInput
          type="text"
          value={expression}
          autocapitalize="none"
          autocorrect="off"
          onChange={e => setExpression(e.target.value)}
          onFocus={() => clearInterval(showcaseIntervalRef.current)}
        />
        <Submit
          type="submit"
          onClick={e => {
            e.preventDefault();
            doDraw(expression);
          }}
        >
          Draw
        </Submit>
      </Form>
      <Container>
        <Canvas ref={cartesianCanvasRef} width="300" height="300"/>
        <Canvas ref={polarCanvasRef} width="300" height="300"/>
      </Container>
    </>
  );
};
