"use client";

interface ContainerProps {
  children: React.ReactNode;
  categoryContainer?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  categoryContainer,
}) => {
  return (
    <div
      className={`
        ${categoryContainer ? "flex flex-row items-center justify-between" : ""}
        mx-auto
        xl:px-20
        md:px-10
        sm:px-2
        px-4
      `}
    >
      {children}
    </div>
  );
};

export default Container;
