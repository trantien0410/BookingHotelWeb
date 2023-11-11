// CountrySelect.tsx
import Select from "react-select";
import useCountries from "@/app/hooks/useCountries";
import { useState } from "react";

export type CountrySelectValue = {
  label: string;
  value: string;
};

interface CountrySelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ onChange }) => {
  const { getAll } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<CountrySelectValue | null>(null);

  const handleCountryChange = (value: CountrySelectValue | null) => {
    if (value) {
      setSelectedCountry(value);
      onChange(value);
    }
  };

  return (
    <Select
      placeholder="Country"
      options={getAll()}
      value={selectedCountry}
      onChange={handleCountryChange}
    />
  );
};

export default CountrySelect;