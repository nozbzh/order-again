import React from "react";

import Establishment from "models/Establishment";
import EstablishmentDetail from "components//establishment/EstablishmentDetail";

import { EstablishmentInterface } from "types";
import logger from "utils/logger";

interface EstablishmentPageProps {
  establishment: EstablishmentInterface;
}

export async function getServerSideProps(context) {
  const {
    params: { id },
  } = context;

  let establishment = {};

  try {
    establishment = await Establishment.find(id);
  } catch (e: any) {
    logger.error(e);
  }

  return {
    props: { establishment },
  };
}

const EstablishmentPage = ({
  establishment,
}: EstablishmentPageProps): JSX.Element => {
  return <EstablishmentDetail establishment={establishment} />;
};

export default EstablishmentPage;
