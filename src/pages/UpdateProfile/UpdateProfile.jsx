"use client";

import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../context/AuthContext";
import UpdateProfileModel from "./UpdateProfileModel";
import WithdrawModel from "./WithdrawModel";
import UserEvents from "./UserEvents";
import axiosInstance from "../../utils/axiosInstance";
import { storage } from "../../utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast, Toaster } from "sonner";
import { ClipLoader } from "react-spinners";

export default function UpdateProfile() {
  const {
    user,
    addBankAccount,
    totalEarnings,
    requestWithdrawal,
    updateProfile,
  } = useAuth();
  const [myEvents, setMyEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankAccountModalOpen, setIsBankAccModalOpen] = useState(false);
  const [profileModel, setProfileModel] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  console.log("user", user);

  useEffect(() => {
    try {
      axiosInstance.get(`/events/get-my-events`).then((res) => {
        console.log("my events", res);
        setMyEvents(res?.data?.createdEvents);
      });
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Upload the profile picture to Firebase and update the user's profile
  const handleProfilePictureUpdate = async () => {
    if (!profilePicture) {
      toast.error("Please select a profile picture.");
      return;
    }

    try {
      setProfileUpdateLoading(true);
      const profilePictureURL = await uploadImage(
        profilePicture,
        "profilePictures"
      );

      // Update the user profile with the new profile picture URL
      await updateProfile({ profile_picture: profilePictureURL });

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setProfileModel(false);
      setProfileUpdateLoading(false);
    }
  };

  // Helper function to upload the image to Firebase
  const uploadImage = (file, folder) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Handle progress here if needed
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  //   const handleRequestWithdrawal = async () => {
  //     try {
  //       await requestWithdrawal();
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };

  return (
    <>
      <Toaster richColors />
      <NavBar />

      <div className="mx-auto max-w-7xl pt-16 lg:gap-x-16 lg:px-8 ">
        <h1 className="sr-only">General Settings</h1>

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

              <div className="flex items-center gap-x-10 pt-5">
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold">Followers</h1>
                  <span>{user?.followers?.length || 0}</span>{" "}
                  {/* Dynamically show followers */}
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold">Following</h1>
                  <span>{user?.following?.length || 0}</span>{" "}
                  {/* Dynamically show following */}
                </div>
              </div>

              <div className="flex items-center gap-x-4 pt-5">
                <img
                  src={
                    user?.profile_picture ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  } // Show default image if none
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                  onClick={() => setProfileModel(true)}
                >
                  Update Profile Picture
                </button>
              </div>

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
              </dl>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  Update
                </button>
              </div>
            </div>

            <div>
              <UserEvents events={myEvents} />
            </div>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Total Earnings
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your total earnings are displayed below.
              </p>

              <div className="mt-6 text-sm leading-6 text-gray-900">
                <span className="font-medium">Total Earnings:</span> R
                {totalEarnings}
              </div>

              {totalEarnings > 50 && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1.5 rounded-md"
                    onClick={() => setIsBankAccModalOpen(true)}
                  >
                    Request Withdrawal
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {profileModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Update Profile Picture
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleProfilePictureUpdate}
              >
                {profileUpdateLoading ? <ClipLoader /> : "Update"}
              </button>
              <button
                disabled={profileUpdateLoading}
                className={`bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ${
                  profileUpdateLoading && "cursor-not-allowed"
                }`}
                onClick={() => setProfileModel(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <UpdateProfileModel open={isModalOpen} setOpen={setIsModalOpen} />

      <WithdrawModel
        open={isBankAccountModalOpen}
        setOpen={setIsBankAccModalOpen}
      />
    </>
  );
}
