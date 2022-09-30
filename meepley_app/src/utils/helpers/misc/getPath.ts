import * as shape from "d3-shape";

export const getPath = (
  width: number,
  height: number,
  centerWidth: number,
  isInsideMatchroom: boolean
) => {
  const circleWidth = centerWidth + 15;

  const pathBorderTopLeftRight = shape
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(shape.curveBasis)(
    !isInsideMatchroom
      ? [
          // right
          { x: (width - circleWidth) / 2 + circleWidth + 20, y: 0 },
          { x: width - 40, y: 0 },
          { x: width - 20, y: 4 },
          { x: width - 4, y: 20 },
          { x: width, y: 30 },
          { x: width, y: height },
          { x: width, y: height },
          // bottom
          { x: width, y: height },
          { x: 0, y: height },
          // left
          { x: 0, y: height },
          { x: 0, y: height },
          { x: 0, y: 30 },
          { x: 0 + 4, y: 20 },
          { x: 0 + 20, y: 4 },
          { x: 0 + 40, y: 0 },
          { x: (width - circleWidth) / 2 - 20, y: 0 },

          { x: (width - circleWidth) / 2 - 18, y: 0 }, // border center left
          { x: (width - circleWidth) / 2 - 10, y: 2 },
          { x: (width - circleWidth) / 2 - 2, y: 10 },
          { x: (width - circleWidth) / 2, y: 15 },

          {
            x: width / 2 - circleWidth / 2 + 15,
            y: height / 3 + 2,
          },
          { x: width / 2 - 10, y: height / 3 + 10 },
          { x: width / 2, y: height / 3 + 10 },
          { x: width / 2 + 10, y: height / 3 + 10 },
          {
            x: width / 2 + circleWidth / 2 - 15,
            y: height / 3 + 2,
          },

          { x: (width - circleWidth) / 2 + circleWidth, y: 15 }, // border center right
          {
            x: (width - circleWidth) / 2 + circleWidth + 2,
            y: 10,
          },
          {
            x: (width - circleWidth) / 2 + circleWidth + 10,
            y: 2,
          },
          {
            x: (width - circleWidth) / 2 + circleWidth + 18,
            y: 0,
          },
        ]
      : [
          // right
          { x: (width - circleWidth) / 2 + circleWidth + 20, y: 0 },
          { x: width - 40, y: 0 },
          { x: width - 20, y: 4 },
          { x: width - 4, y: 20 },
          { x: width, y: 30 },
          { x: width, y: height },
          { x: width, y: height },
          // bottom
          { x: width, y: height },
          { x: 0, y: height },
          // left
          { x: 0, y: height },
          { x: 0, y: height },
          { x: 0, y: 30 },
          { x: 0 + 4, y: 20 },
          { x: 0 + 20, y: 4 },
          { x: 0 + 40, y: 0 },
          { x: (width - circleWidth) / 2 - 20, y: 0 },
        ]
  );

  return pathBorderTopLeftRight;
};
