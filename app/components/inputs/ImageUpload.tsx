"use client";

import { CldUploadWidget } from "next-cloudinary";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../Button";
import { BiUpload } from "react-icons/bi";
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
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden "
          >
            <div className="z-10 absolute top-2 right-2 h-10 w-5">
              <Button label=" X " onClick={() => onRemove(url)} />
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="p19hqrji">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              outline
              label="Upload an Image"
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
