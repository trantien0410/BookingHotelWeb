"use client";

import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import { FiEyeOff, FiEye } from "react-icons/fi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  multiline?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any }; // Adjust based on your error object structure
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  multiline,
  register,
  required,
  errors,
}) => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle function
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}
      {!multiline && type === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className=" text-neutral-700 absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
        </button>
      )}
      {multiline ? (
        <textarea
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
        />
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          type={showPassword && type === "password" ? "text" : type} // Use state to determine input type
          className={`
        peer
        w-full
        p-4
        pt-6 
        font-light 
        bg-white 
        border-2
        rounded-md
        outline-none
        transition
        disabled:opacity-70
        disabled:cursor-not-allowed
        ${formatPrice ? "pl-9" : "pl-4"}
        ${errors[id] ? "border-rose-500" : "border-neutral-300"}
        ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
      `}
        />
      )}
      <label
        className={`
          absolute 
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
      {/* Error message display */}
      {errors[id] && (
        <p className="text-rose-500 text-sm mt-1">{errors[id].message}</p>
      )}
    </div>
  );
};

export default Input;
