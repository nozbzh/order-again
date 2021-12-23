import React from "react";
import styled from "styled-components";

const RatingContainer = styled.div`
  cursor: ${(props) => (props.disabled ? "" : "pointer")};
  color: ${(props) => {
    if (props.disabled) {
      return props.ratingColor;
    }

    if (props.unrated) {
      return "black";
    }
  }};
  margin-left: auto;
`;

interface RatingProp {
  ratingValue: string;
  displayValue: string;
  ratingColor: string;
  onClick: () => void;
}

const Rating = ({
  ratingValue,
  onClick,
  displayValue,
  ratingColor,
}: RatingProp): JSX.Element => {
  const disabled = ratingValue === displayValue;
  const unrated = !Boolean(ratingValue);

  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <>
      <RatingContainer
        onClick={handleClick}
        disabled={disabled}
        unrated={unrated}
        ratingColor={ratingColor}
      >
        {displayValue}
      </RatingContainer>
    </>
  );
};

export default Rating;
