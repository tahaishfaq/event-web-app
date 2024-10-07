import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();

  const navigate = useNavigate();

  const navigation = [
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <>
      <Toaster richColors />
      <header className="absolute inset-x-0 top-0 z-50 ">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        >
          <div className="lg:flex lg:flex-1 hidden">
            <Link to="/events" className="-m-1.5 p-1.5">
              <span className="font-bold font-dancingScript text-2xl">Event Circle</span>
            </Link>
          </div>
          <div className="lg:hidden flex items-center justify-center">
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={
                      user?.profile_picture ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    className="h-8 w-8 rounded-full object-cover object-center"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem as="div">
                  <Link
                    to="/show-profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem as="div">
                  <Link
                    to="/my-tickets"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    My Tickets
                  </Link>
                </MenuItem>
                <MenuItem as="div">
                  {localStorage.getItem("authToken") !== "" && (
                    <span
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      Log out
                    </span>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
            <span className="pl-1.5 text-sm text-gray-700 font-medium">
              {user?.fullname}
            </span>
          </div>
          <div className="flex lg:hidden items-center gap-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 ">
            {navigation?.map((item) => (
              <Link
                key={item?.name}
                to={item?.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item?.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="flex items-center justify-center">
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={
                        user?.profile_picture ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      className="h-8 w-8 rounded-full object-cover object-center"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem as="div">
                    <Link
                      to="/show-profile"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem as="div">
                    <Link
                      to="/my-tickets"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"
                    >
                      My Tickets
                    </Link>
                  </MenuItem>
                  <MenuItem as="div">
                    {localStorage.getItem("authToken") !== "" && (
                      <span
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"
                      >
                        Log out
                      </span>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
              <span className="pl-1.5 text-sm text-gray-700 font-medium">
                {user?.fullname}
              </span>
            </div>

            {/* {localStorage.getItem("authToken") == "" ? (
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <span
                onClick={handleLogout}
                className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer hover:underline"
              >
                Log out <span aria-hidden="true">&rarr;</span>
              </span>
            )} */}
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-[1000]" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/events" className="-m-1.5 p-1.5">
                <span className="font-bold font-dancingScript text-2xl">Event Circle</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation?.map((item) => (
                    <Link
                      key={item?.name}
                      to={item?.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  );
};

export default NavBar;
