import React from "react";
import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/router";

import { notifyError, getErrorMessage } from "utils/ui";

interface HopePageProps {
  establishmentType: string;
}

const SEARCH_DEBOUNCE_INTERVAL = 300;

const HomePage = ({ establishmentType }: HopePageProps): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [establishment, setEstablishment] = React.useState({});
  const [options, setOptions] = React.useState([]);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    if (!query) {
      if (options.length) {
        setOptions([]);
      }
      return;
    }

    setLoading(true);
    const url = `/api/establishments/search?q=${query}`;

    try {
      const response = await axios.get(url);
      setOptions(get(response, "data.payload", []));
    } catch (e: any) {
      setOptions([]);
      notifyError(`Could not fetch establishments: ${getErrorMessage(e)}`);
    }

    setLoading(false);
  };

  const debouncedSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  }, SEARCH_DEBOUNCE_INTERVAL);

  return (
    <>
      <Autocomplete
        options={options}
        loading={loading}
        onClose={() => {
          setOptions([]);
        }}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setEstablishment(newValue);
          router.push(`/establishments/${newValue.id}`);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={debouncedSearch}
            variant="standard"
          />
        )}
        renderOption={(props, option) => {
          return <li {...props}>{`${option.name} (${option.address})`}</li>;
        }}
      />
      {!isEmpty(establishment) && (
        <div>{`Selected is: ${JSON.stringify(establishment, null, 2)}`}</div>
      )}
    </>
  );
};

export default HomePage;
