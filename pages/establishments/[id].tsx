import React from "react";

import Establishment from "models/Establishment";
import EstablishmentDetail from "components//establishment/EstablishmentDetail";

import { Establishment as PrismaEstablishment } from "@prisma/client";
import logger from "utils/logger";

interface EstablishmentPageProps {
  establishment: PrismaEstablishment;
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
