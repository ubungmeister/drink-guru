import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { RiMenu3Fill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import {MenuItemComponent} from "@/components/header/MenuItemComponent";
export const MenuList = () => {
  const { data: session } = useSession();

  const menuItems = session
  ? [
      { href: "/drink-generator", label: "New Drink" },
      { href: "/saved-drinks", label: "Saved Drinks" },
      { href: "/api/auth/signout", label: "Sign Out" },
    ]
  : [
      { href: "/signin", label: "Saved Drinks" },
      { href: "/signin", label: "Sign in" },
    ];

  return (
    <div className=" z-50 text-right absolute top-0 right-0 px-8 py-10 md:px-4 md:py-4">
      <Menu as="div" className="relative inline-block text-left ">
        <MenuButton className="inline-flex items-center justify-center w-6 h-6 relative">
          <RiMenu3Fill className="w-6 h-6 text-gray-700 md:text-white" />
        </MenuButton>
        <MenuItems className="absolute right-0 mt-4 z-50  min-w-32 max-w-80 origin-top-right divide-y divide-gray-200 rounded-md border border-gray-300 bg-white shadow-lg font-sans">
          <div className="flex flex-col space-y-0.5 text-gray-700 text-sm px-2 justify-center py-4 placeholder-opacity-80 w-auto">
          {menuItems.map((item, index) => (
              <MenuItem key={index}>
                {({ focus }) => (
                  <MenuItemComponent
                    href={item.href}
                    label={item.label}
                    focusClass={focus}
                  />
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};
