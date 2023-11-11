// StateSelect.tsx
import Select from "react-select";
import useCountries from "@/app/hooks/useCountries";
import { useState } from "react";

export type StateSelectValue = {
  label: string;
  value: string;
};

interface StateSelectProps {
  value?: StateSelectValue;
  countryCode: string;
  onChange: (value: StateSelectValue) => void;
}

const StateSelect: React.FC<StateSelectProps> = ({ countryCode, onChange }) => {
  const { getStatesByCountry } = useCountries();
  const [selectedState, setSelectedState] = useState<StateSelectValue | null>(null);

  const handleStateChange = (value: StateSelectValue | null) => {
    if (value) {
      setSelectedState(value);
      onChange(value);
    }
  };

  return (
    <Select
      placeholder="State"
      options={getStatesByCountry(countryCode)}
      value={selectedState}
      onChange={handleStateChange}
    />
  );
};

export default StateSelect;