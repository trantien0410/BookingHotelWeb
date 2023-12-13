"use client";

import Button from "@/app/components/Button";
import Calendar from "@/app/components/inputs/Calendar";
import { Range } from "react-date-range";

interface RestaurantListingReservationProps {
  price: number;
  dateRange: Range;
  totalPerNight: number;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates?: Date[] | [];
  daysCount?: number;
  fees: { name: string; amount: number }[] | [];
  tax: number;
}

const RestaurantListingReservation: React.FC<
  RestaurantListingReservationProps
> = ({
  price,
  dateRange,
  totalPerNight,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  daysCount,
  fees,
  tax,
}) => {
  return (
    <div
      className="
                bg-white
                rounded-xl
                border-[1px]
                border-neutral-300
                overflow-hidden
                drop-shadow-xl
                p-6
                min-w-xl
            "
    >
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">${price}</div>
        <div className="font-light next-neutral-600">meal</div>
      </div>
      {/* <hr /> */}
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(val) => onChangeDate(val.selection)}
      />
      <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      <div className="flex flex-row justify-between my-6 text-neutral-560">
        <div className="underline">
          ${price} x {daysCount || 1} {daysCount || 1 > 1 ? "days" : "day"}
        </div>
        <div>${totalPerNight}</div>
      </div>
      <div>
        {fees.map((fee, index) => (
          <div
            key={index}
            className="flex flex-row justify-between my-6 text-neutral-600"
          >
            <div className="underline">{fee.name}</div>
            <div>{`$${fee.amount}`}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between my-6 text-neutral-600">
        <div className="underline">Taxes</div>
        <div>${tax}</div>
      </div>
      <hr className="my-4" />
      <div
        className="
                    flex
                    flex-row
                    items-center
                    justify-between
                    font-semibold
                "
      >
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  );
};

export default RestaurantListingReservation;
