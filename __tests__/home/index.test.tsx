import React from "react";
import TestRenderer from "react-test-renderer";
import Home from "../../src/pages/home/index";

describe("Home", () => {
  it("should render without throwing an error", () => {
    const testRenderer = TestRenderer.create(<Home />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
