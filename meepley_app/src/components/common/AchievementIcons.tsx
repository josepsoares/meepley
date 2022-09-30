import React, { useMemo } from "react";
// import AppSvg from "../../assets/icons/achievements/app.svg";
import MatchroomSvg from "../../assets/icons/achievements/matchroom.svg";
// import CalibrationSvg from "../../assets/icons/achievements/calibration.svg";
import CommunitySvg from "../../assets/icons/achievements/community.svg";
import EventsSvg from "../../assets/icons/achievements/event.svg";
import BoardgameSvg from "../../assets/icons/achievements/boardgame.svg";
import LocationsSvg from "../../assets/icons/achievements/location.svg";
import SpecialSvg from "../../assets/icons/achievements/special.svg";
import SocialSvg from "../../assets/icons/achievements/social.svg";

interface IAchievementIcons {
  community: JSX.Element;
  matchroom: JSX.Element;
  events: JSX.Element;
  boardgame: JSX.Element;
  location: JSX.Element;
  special: JSX.Element;
  social: JSX.Element;
}

export type IAchievementIconsKeys = keyof IAchievementIcons;

const useAchievementIcons = ({
  width = 24,
  height = 24,
  fill = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  fill?: string;
}) => {
  return {
    community: <CommunitySvg width={width} height={height} />,
    matchroom: <MatchroomSvg width={width} height={height} />,
    events: <EventsSvg width={width} height={height} />,
    boardgame: <BoardgameSvg width={width} height={height} />,
    location: <LocationsSvg width={width} height={height} />,
    special: <SpecialSvg width={width} height={height} />,
    social: <SocialSvg width={width} height={height} />,
  };
};

export default useAchievementIcons;
