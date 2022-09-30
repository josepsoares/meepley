import React from "react";
import AirSvg from "../../assets/icons/card-attributes/air.svg";
import CultureSvg from "../../assets/icons/card-attributes/culture.svg";
import EarthSvg from "../../assets/icons/card-attributes/earth.svg";
import FireSvg from "../../assets/icons/card-attributes/fire.svg";
import SpecialSvg from "../../assets/icons/achievements/special.svg";
import WaterSvg from "../../assets/icons/card-attributes/water.svg";

interface ICardAttributesIcons {
  air: JSX.Element;
  culture: JSX.Element;
  earth: JSX.Element;
  fire: JSX.Element;
  nature: JSX.Element;
  soul: JSX.Element;
  tech: JSX.Element;
  water: JSX.Element;
}

export type ICardAttributesIconsKeys = keyof ICardAttributesIcons;

const useCardAttributesIcons = ({
  width = 24,
  height = 24,
  fill = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  fill?: string;
}) => {
  return {
    air: <AirSvg width={width} height={height} />,
    culture: <CultureSvg width={width} height={height} />,
    earth: <EarthSvg width={width} height={height} />,
    fire: <FireSvg width={width} height={height} />,
    nature: <SpecialSvg width={width} height={height} />,
    soul: <SpecialSvg width={width} height={height} />,
    tech: <SpecialSvg width={width} height={height} />,
    water: <WaterSvg width={width} height={height} />,
  };
};

export default useCardAttributesIcons;

