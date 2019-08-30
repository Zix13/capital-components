import { configure } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";
import { addDecorator } from "@storybook/react";
import "carbon-components/css/carbon-components.css";
import "../styles/css/styles.css";
import "../styles/css/cap-grid-legacy.css";
import "./styles.css";
import React from "react";
import { ThemeProvider } from "../src/support/theme";
import { themes } from "@carbon/themes";
import excludedPropTypes from "./excludedPropTypes";
import StoryRouter from "../storybook-addons/router";
import createTheme from "../src/support/createTheme";

setOptions({
  name: "Capital Components",
  url: "https://github.ibm.com/watson-finance/wfss-components",
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/,
  sortStoriesByKind: true
});

const theme = createTheme(themes.g10);

const enableHooks = Story => <Story />;

// Note that this prevents addon-info from analyzing used components. I think it's worth it
// to use hooks.
addDecorator(enableHooks);
addDecorator(story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);
addDecorator(StoryRouter());

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /.stories.(js|ts)x?$/);
const req2 = require.context("../src", true, /\/stories.(js|ts)x?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
  req2.keys().forEach(filename => req2(filename));
}

configure(loadStories, module);
