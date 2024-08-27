import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiMenuAlt4 } from "react-icons/hi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { capitalize } from "@/utilities/capitalize";
import Image from "next/image";
import menu from "@/assets/menu.svg";
import menuweb from "@/assets/menuweb.svg";

export const HeaderMenu = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  return (
    <div className="z-50 text-right">
      <Menu
        as="div"
        className="relative inline-block text-left text-base-content "
      >
        <div>
          <MenuButton className="inline-flex w-full justify-center py-2 ">
            <Image
              src={menu}
              alt="martini"
              className="block md:hidden"
              width={70}
              height={70}
            />
            <Image
              src={menuweb}
              alt="martini"
              className="hidden md:block "
              width={50}
              height={50}
            />
          </MenuButton>
        </div>
        <MenuItems className="absolute right-0 mt-4 w-60 origin-top-right divide-y divide-neutral rounded-md border border-neutral bg-gray-50 shadow-sm">
          <div className="flex flex-col space-y-1 text-gray-700 text-sm px-2 justify-center py-4 placeholder-opacity-80">
            {session ? (
              <>
                <MenuItem>
                  <p className="flex w-full px-4 py-2 text-sm text-gray-700  hover:bg-info-content hover:text-white cursor-pointer ">
                    {capitalize(userName || "")}
                  </p>
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`${
                        focus ? "bg-info-content text-white" : ""
                      } flex w-full px-4 py-2 text-sm text-gray-700 `}
                      href="/saved-drinks"
                    >
                      Saved
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`${
                        focus ? "bg-info-content text-white" : ""
                      } flex w-full px-4 py-2 text-sm text-gray-700 `}
                      href="/api/auth/signout"
                    >
                      Sign Out
                    </Link>
                  )}
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`${
                        focus ? "bg-info-content text-white" : ""
                      } flex w-full px-4 py-2 text-sm text-gray-700 `}
                      href="/signin"
                    >
                      Saved
                    </Link>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`${
                        focus ? "bg-info-content text-white" : ""
                      } flex w-full px-4 py-2 text-sm text-gray-700 `}
                      href="/signin"
                    >
                      Sign in
                    </Link>
                  )}
                </MenuItem>
              </>
            )}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};
