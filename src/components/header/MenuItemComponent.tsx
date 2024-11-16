import React from "react";
import Link from "next/link";

type MenuItemProps = {
  href: string;
  label: string;
  focusClass?: boolean;
};

export const MenuItemComponent = ({
  href,
  label,
  focusClass,
}: MenuItemProps) => {
  return (
    <Link
      className={`${
        focusClass ? "bg-info-content text-white" : ""
      } flex w-full px-4 py-2 text-sm font-light text-gray-700 whitespace-nowrap`}
      href={href}
    >
      {label}
    </Link>
  );
};
