import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import styled from "styled-components";
import { NeuralNetwork, likely } from "brain.js";
import DrawableCanvas from "./funcitons";

function App() {
  // USE EFFECT
  // console.log(NeuralNetwork);
  // const puta = [
  //   { input: [0, 0], output: { positive: 1 } },
  //   { input: [0, 1], output: { negative: 1 } },
  //   { input: [1, 0], output: { negative: 1 } },
  //   { input: [1, 1], output: { positive: 1 } },
  // ];
  // net.train(puta);
  // console.log("result =>", net.run([1, 0]));
  // useEffect(() => {
  //   return () => {};
  // }, []);

  // STATE
  const [feelings, setFeelings] = useState(["Positive", "Negative"]);
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [result, setResult] = useState("RESULT");
  const [inTest, setInTest] = useState(false);
  // REFS

  const trainingData = useRef({
    Positive: [null, null, null],
    Negative: [null, null, null],
  });

  const testDataVector = useRef(null);

  // NEURAL NET REF
  const netRef = useRef(new NeuralNetwork({}));

  // FUNCTIONS

  const renderFeelings = () => {
    return feelings.map((feeling, index) => {
      return <Feeling feelingName={feeling} key={index} />;
    });
  };

  const addFeeling = (feelingName) => {
    trainingData.current["Positive"] = [null, null, null];
    trainingData.current["Negative"] = [null, null, null];
    trainingData.current[feelingName] = [null, null, null];
    console.log("training data => ", trainingData.current);
    netRef.current = new NeuralNetwork({});
    return setFeelings([...feelings, feelingName]);
  };

  const trainData = () => {
    const data = [];
    // return console.log(trainingData.current);

    for (const property in trainingData.current) {
      let output = { [property]: 1 };
      if (
        !trainingData.current[property][0] ||
        !trainingData.current[property][1] ||
        !trainingData.current[property][2]
      ) {
        console.log(trainingData.current);
        return alert("please finish all drawing models");
      } else {
        data.push({
          input: trainingData.current[property][0],
          output: output,
        });
        data.push({
          input: trainingData.current[property][1],
          output: output,
        });
        data.push({
          input: trainingData.current[property][2],
          output: output,
        });
      }
    }

    const result = netRef.current.train(data);
    setError(result.error);
    setIterations(result.iterations);
  };

  const testData = (vector) => {
    console.log(vector);
    const result = likely(vector, netRef.current);
    !result && alert("please, train first your AI :)");
    setInTest(!inTest);
    return setResult(result);
  };

  // COMPONENTS
  const Canvas = ({ id, type, feelingName }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing] = useState(false);
    let can;

    // USEEFFECT
    useEffect(() => {
      let canvas = canvasRef.current;
      can = new DrawableCanvas(canvas);

      return () => {};
    }, []);

    const finishDrawing = () => {
      if (type === "testCanvas") {
        return (testDataVector.current = can.getVector());
      }
      trainingData.current[feelingName][id] = can.getVector();
      console.log("finish");
      console.log(can.getVector());
    };

    const draw = ({ nativeEvent }) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    };

    return (
      <CustomCanvas
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        // onMouseDown={startDrawing}
        id={id}
        ref={canvasRef}
      ></CustomCanvas>
    );
  };

  const Feeling = ({ feelingName }) => {
    return (
      <div style={{ flexDirection: "row" }}>
        <Data>{feelingName}</Data>
        <Canvas type="drawer" feelingName={feelingName} id={0}></Canvas>
        <Canvas type="drawer" feelingName={feelingName} id={1}></Canvas>
        <Canvas type="drawer" feelingName={feelingName} id={2}></Canvas>
      </div>
    );
  };

  return (
    <div className="App">
      <Title>The sentimental trainer AI 🤖</Title>
      <Step>
        <Text>Step 1: Prepare your data</Text>
        <Description>Draw your feelings here for the AI</Description>
        {renderFeelings()}
        <Input
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Add feeling"
        ></Input>
        <CustomButton onClick={() => textInput && addFeeling(textInput)}>
          Create new feeling
        </CustomButton>
      </Step>
      <Step>
        <Text>Step 2: Train your AI</Text>
        <Description>
          Train the AI and watch the error-range and iterations that the AI has
          done
        </Description>
        {error !== 0 ? <Text>👍</Text> : null}
        <CustomButton onClick={() => trainData()}>Train</CustomButton>
        <Data>Error : {error}</Data>
        <Data>Iterations:{iterations} </Data>
      </Step>

      <Step>
        <Text>Step 3: Test your Model</Text>
        <Description>Test your model by drawing into the canvas</Description>
        <CustomButton
          onClick={() => {
            testData(testDataVector.current);
          }}
        >
          Test
        </CustomButton>
        <br />
        {/* Here comes the canvas */}
        <Canvas type="testCanvas"></Canvas>

        <Title>{result}</Title>
      </Step>
      <Footer></Footer>
      <Name
        onClick={() => (window.location.href = "http://www.areskyberkane.com")}
      >
        By Aresky Berkane{" "}
      </Name>
      <Description>Please, hire me..</Description>
      <img
        onClick={() =>
          (window.location.href = "https://www.linkedin.com/in/aresky-berkane/")
        }
        width="50"
        height="50"
        src="https://www.tapas-etn-eu.org/images/icon-linkedin.png/@@images/image.png"
        style={{ cursor: "pointer" }}
      ></img>
      <Footer></Footer>
    </div>
  );
}

export default App;
const Title = styled.h1`
  color: #2b2d42;
`;
const Step = styled.div`
  margin-top: 50px;
`;
const Text = styled.h2`
  color: #d80032;
`;
const Name = styled.h2`
  color: #2b2d42;
  cursor: pointer;
`;
const Description = styled.h5`
  color: #2b2d42;
`;
const Data = styled.h2`
  color: #2b2d42;
`;
const CustomButton = styled.button`
  background-color: #ef233c; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
`;
const Input = styled.input`
  border-color: #8d99ae;
  padding: 13px 32px;
  font-size: 16px;
`;
const CustomCanvas = styled.canvas`
  border: 2px solid #2b2d42;
  border-radius: 3px;
  margin: 10px;
  margin-bottom: 10px;
  margin-right: 5px;
  margin-left: 5px;
`;

const Footer = styled.div`
  margin-top: 200px;
`;
