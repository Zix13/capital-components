import React from "react";
import { storiesOf } from "@storybook/react";
import { Grid, Col, FlyOver, FlyOverProvider } from "capital-components";
import styled from "react-emotion";
import * as R from "ramda";
import withExternalWindow from "../storybook-addons/external-window";
import { css } from "emotion";

const ColumnContent = styled("div")`
  background-color: white;
  width: 100%;
  height: 100vh;
  z-index: 5;

  font-size: 32px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const Wrapper = styled("div")`
  background: #97fbcc;
  display: flex;
  position: relative;
  .cap-grid {
    position: relative;
  }
  > .cap-grid::before {
    content: "";
    left: 5vw;
    width: calc(100% - 10vw);
    height: 100%;
    position: absolute;
    background-color: #8babd7;
    z-index: 4;
  }
`;

const PushNav = styled("div")`
  min-width: 360px;
  height: auto;
  background-color: #fd77fc;
`;

const flyOverStyle = css`
  background-color: #b17ffa;
`;

storiesOf("Layout|Grids", module)
  .addDecorator(withExternalWindow())
  .add(
    "Default",
    () => (
      <Wrapper>
        <Grid isContainer>
          {R.range(0, 16).map(index => (
            <Col size={1} key={index}>
              <ColumnContent>{index + 1}</ColumnContent>
            </Col>
          ))}
        </Grid>
      </Wrapper>
    ),
    {
      info: { disable: true }
    }
  )
  .add(
    'Left "Nav"',
    () => (
      <Wrapper>
        <PushNav />
        <Grid isContainer preventShrink={false}>
          {R.range(0, 12).map(index => (
            <Col size={1} key={index}>
              <ColumnContent>{index + 1}</ColumnContent>
            </Col>
          ))}
        </Grid>
      </Wrapper>
    ),
    {
      info: { disable: true }
    }
  )
  .add(
    'Right "Nav"',
    () => (
      <Wrapper>
        <Grid isContainer preventShrink={false}>
          {R.range(0, 12).map(index => (
            <Col size={1} key={index}>
              <ColumnContent>{index + 1}</ColumnContent>
            </Col>
          ))}
        </Grid>
        <PushNav />
      </Wrapper>
    ),
    {
      info: { disable: true }
    }
  )
  .add(
    'Left "Flyover"',
    () => (
      <Wrapper>
        <FlyOverProvider>
          <FlyOver position="left" width="md" className={flyOverStyle} show />
          <Grid isContainer preventShrink={false}>
            {R.range(0, 12).map(index => (
              <Col size={1} key={index}>
                <ColumnContent>{index + 1}</ColumnContent>
              </Col>
            ))}
          </Grid>
        </FlyOverProvider>
      </Wrapper>
    ),
    {
      info: { disable: true }
    }
  )
  .add(
    'Right "Flyover"',
    () => (
      <Wrapper>
        <FlyOverProvider>
          <Grid isContainer preventShrink={false}>
            {R.range(0, 12).map(index => (
              <Col size={1} key={index}>
                <ColumnContent>{index + 1}</ColumnContent>
              </Col>
            ))}
          </Grid>
          <FlyOver position="right" width="md" className={flyOverStyle} show />
        </FlyOverProvider>
      </Wrapper>
    ),
    {
      info: { disable: true }
    }
  );
