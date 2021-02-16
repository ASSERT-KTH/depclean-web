import { dimension } from "src/interfaces/interfaces";

export const marks = {
    0: 'None',
    50: 'Direct',
    100: {
        style: {
            color: "hsla(119,38,56,1)",
            fontWeight: 600,
        },
        label: "All",
    },
};

const marginRight = 0;
const marginLeft = 20;
const marginTop = 15;
const marginBottom = 15;
const width = 400;
const height = 70;

export const dimensions: dimension = {
    width: width,
    height: height,
    marginTop: marginTop,
    marginRight: marginRight,
    marginBottom: marginBottom,
    marginLeft: marginLeft,
    boundedHeight: height - marginTop + marginBottom,
    boundedWidth: width - marginRight - marginLeft,
};
