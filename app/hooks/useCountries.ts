import { Country, State } from "country-state-city";

const formattedCountries = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  };

  const getStatesByCountry = (countryCode: string) => {
    return State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  };

  return {
    getAll,
    getByValue,
    getStatesByCountry,
  };
};

export default useCountries;
