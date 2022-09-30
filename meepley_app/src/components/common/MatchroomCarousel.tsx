import React, { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useWindowDimensions } from "react-native";

import MatchroomCard from "./MatchroomCard";
import { widthPer } from "../../utils/helpers/misc/widthPercentage";
import { IMatchroom } from "../../ts/interfaces/IMatchroom";

const colors = ["lYellow.700", "brand.500", "lGreen.600"];

const MatchroomCarousel: React.FC<{
  matchRooms: IMatchroom[];
  pagination?: boolean;
}> = ({ matchRooms, pagination = true }) => {
  const [sliderActiveItem, setSliderActiveItem] = useState(1);
  const { width: viewportWidth } = useWindowDimensions();

  const slideWidth = widthPer(55, viewportWidth);
  const itemHorizontalMargin = widthPer(2, viewportWidth);
  const sliderWidth = viewportWidth;
  const ITEM_WIDTH = Math.round(sliderWidth * 0.65);
  let sliderRef;

  return (
    <>
      <Carousel
        ref={(c) => (sliderRef = c)}
        data={matchRooms}
        renderItem={({ item, index }) => {
          const bgColor = colors[(index + 1) % colors.length];
          const isActive = sliderActiveItem === index;

          return (
            <MatchroomCard
              item={item}
              isActive={isActive}
              index={index}
              bgColor={bgColor}
            />
          );
        }}
        sliderWidth={sliderWidth}
        itemWidth={ITEM_WIDTH}
        firstItem={0}
        inactiveSlideScale={0.8}
        inactiveSlideOpacity={0.4}
        inactiveSlideShift={0}
        autoplay={false}
        activeSlideAlignment="center"
        onSnapToItem={(index) => setSliderActiveItem(index)}
      />

      {pagination && (
        <Pagination
          dotsLength={matchRooms.length}
          activeDotIndex={sliderActiveItem}
          dotColor="#7D65D2"
          inactiveDotColor="rgba(78, 78, 78, 0.92)"
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
          dotStyle={{
            width: 20,
            height: 20,
            borderRadius: 20,
          }}
          carouselRef={sliderRef}
          tappableDots={!!sliderRef}
        />
      )}
    </>
  );
};

export default MatchroomCarousel;
