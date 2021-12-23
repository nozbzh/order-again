import React from "react";
import axios from "axios";
import get from "lodash/get";

import Rating from "./Rating";
import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { RatingInterface } from "types";

interface RatingsProps {
  ratings: RatingInterface[];
  itemId: string;
  establishmentId: string;
}

const Ratings = ({
  ratings,
  itemId,
  establishmentId,
}: RatingsProps): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [rating, setRating] = React.useState(ratings[0]);

  const fetchRating = async () => {
    setLoading(true);
    const url = `/api/establishments/${establishmentId}/items/${itemId}/ratings/user-rating`;

    try {
      const response = await axios.get(url);
      const ratingResp = get(response, "data.payload", {});
      setRating(ratingResp);
    } catch (e: any) {
      notifyError(`Could not fetch rating: ${getErrorMessage(e)}`);
    }

    setLoading(false);
  };

  const rate = async (ratingValue: string, ratingId?: string) => {
    setLoading(true);
    try {
      if (ratingId) {
        const url = `/api/establishments/${establishmentId}/items/${itemId}/ratings/${ratingId}`;
        await axios.patch(url, { value: ratingValue });
      } else {
        const url = `/api/establishments/${establishmentId}/items/${itemId}/ratings`;
        await axios.post(url, { value: ratingValue });
      }

      notifySuccess("Saved!");
      fetchRating();
    } catch (e: any) {
      notifyError(`Operation failed: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  const like = () => {
    if (rating?.id) {
      rate("10", rating.id);
    } else {
      rate("10");
    }
  };

  const dislike = () => {
    if (rating?.id) {
      rate("1", rating.id);
    } else {
      rate("1");
    }
  };

  const ratingValuesMap = {
    "1": "Bad",
    "10": "Good",
  };

  const ratingValue = ratingValuesMap[rating?.value];

  return (
    <>
      <Rating
        onClick={like}
        displayValue="Good"
        ratingValue={ratingValue}
        ratingColor="green"
      />
      <Rating
        onClick={dislike}
        displayValue="Bad"
        ratingValue={ratingValue}
        ratingColor="red"
      />
    </>
  );
};

export default Ratings;
