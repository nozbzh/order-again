import * as React from "react";

import EstablishmentForm from "components/establishment/EstablishmentForm";
import logger from "utils/logger";
import Establishment from "models/Establishment";
import { Establishment as PrismaEstablishment } from "@prisma/client";

interface EditEstablishmentProps {
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

const EditEstablishment = ({
  establishment,
}: EditEstablishmentProps): JSX.Element => {
  return <EstablishmentForm establishment={establishment} />;
};

export default EditEstablishment;
