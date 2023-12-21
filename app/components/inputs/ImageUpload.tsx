"use client";

import { CldUploadWidget } from "next-cloudinary";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../Button";
import { BiUpload } from "react-icons/bi";
import IconButton from "../Icon-Button";
import { X } from "lucide-react";
interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 4;

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedImages = value.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );
  const onRemoveImages = (url: string) => {
    // Call the original onRemove function
    onRemove(url);

    // After removing the image, check if the current page is empty
    // If it is, and it's not the first page, go back to the previous page
    if (
      value.filter((item) => item !== url).length % imagesPerPage === 0 &&
      currentPage !== 0
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {paginatedImages.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden "
          >
            <div className="z-10 absolute top-2 right-2">
              <IconButton
                icon={<X size={15} />}
                onClick={() => onRemoveImages(url)}
              />
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      {value.length > 0 ? (
        <div className="flex items-center justify-end space-x-2 py-4">
          <button
            className=" relative
                          disabled:opacity-70
                          disabled:cursor-not-allowed
                          rounded-lg
                          hover:opacity-80
                          transition
                          bg-white
                          text-black
                          py-3
                          text-md
                          font-semibold"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            className=" relative
                          disabled:opacity-70
                          disabled:cursor-not-allowed
                          rounded-lg
                          hover:opacity-80
                          transition
                          bg-white
                          text-black
                          py-3
                          text-md
                          font-semibold"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={(currentPage + 1) * imagesPerPage >= value.length}
          >
            Next
          </button>
        </div>
      ) : null}
      <CldUploadWidget onUpload={onUpload} uploadPreset="p19hqrji">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              outline
              label="Upload the Images"
              icon={BiUpload}
              disabled={disabled}
              onClick={onClick}
            />
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
export default ImageUpload;
