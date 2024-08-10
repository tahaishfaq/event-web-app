"use client";

import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../context/AuthContext";
import UpdateProfileModel from "./UpdateProfileModel";
import WithdrawModel from "./WithdrawModel";

const secondaryNavigation = [
  { name: "General", href: "#", icon: UserCircleIcon, current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UpdateProfile() {
  const { user, addBankAccount, totalEarnings, requestWithdrawal } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankAccountModalOpen, setIsBankAccModalOpen] = useState(false);



//   const handleRequestWithdrawal = async () => {
//     try {
//       await requestWithdrawal();
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

  return (
    <>
      <NavBar />

      <div className="mx-auto max-w-7xl pt-16 lg:gap-x-16 lg:px-8 ">
        <h1 className="sr-only">General Settings</h1>

        {/* <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul
              role="list"
              className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-50 text-purple-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-purple-600",
                      "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current
                          ? "text-purple-600"
                          : "text-gray-400 group-hover:text-purple-600",
                        "h-6 w-6 shrink-0"
                      )}
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside> */}

        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Full name
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{user?.fullname}</div>
                    {/* <button
                                            type="button"
                                            className="font-semibold text-purple-600 hover:text-purple-500"
                                            onClick={openModal}
                                        >
                                            Update
                                        </button> */}
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Email address
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{user?.email}</div>
                    {/* <button
                                            type="button"
                                            className="font-semibold text-purple-600 hover:text-purple-500"
                                            onClick={openModal}
                                        >
                                            Update
                                        </button> */}
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Phone Number
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{user?.phone_number}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Front Picture
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <a href={user?.front_picture} target="_blank" className=" bg-purple-500 px-4 py-1 rounded-md text-white">Open Front Picture</a>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Back Picture
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <a href={user?.back_picture} target="_blank" className=" bg-purple-500 px-4 py-1 rounded-md text-white">Open Back Picture</a>
                  </dd>
                </div>
              </dl>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="font-semibold text-purple-600 hover:text-purple-500"
                  onClick={() => setIsModalOpen(true)}
                >
                  Update
                </button>
              </div>
            </div>

            {/* <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Bank accounts
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Connect bank accounts to your account.
              </p>

              <ul
                role="list"
                className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
              >
                {user?.bank_account_number && (
                  <li className="flex justify-between gap-x-6 py-6">
                    <div className="font-medium text-gray-900">
                      {user?.bank_account_number}
                    </div>
                  </li>
                )}
              </ul>

              <div className="flex border-t border-gray-100 pt-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-purple-600 hover:text-purple-500"
                  onClick={() => setIsBankAccModalOpen(true)}
                >
                  <span aria-hidden="true">+</span> Add another bank
                </button>
              </div>
            </div> */}

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Total Earnings
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your total earnings are displayed below.
              </p>

              <div className="mt-6 text-sm leading-6 text-gray-900">
                <span className="font-medium">Total Earnings:</span> $
                {totalEarnings}
              </div>

              {totalEarnings > 50 && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1.5 rounded-md"
                    onClick={()=> setIsBankAccModalOpen(true) }
                  >
                    Request Withdrawal
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <UpdateProfileModel open={isModalOpen} setOpen={setIsModalOpen} />

      <WithdrawModel
        open={isBankAccountModalOpen}
        setOpen={setIsBankAccModalOpen}
      />
    </>
  );
}
