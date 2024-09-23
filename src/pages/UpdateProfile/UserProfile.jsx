import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

import { toast, Toaster } from "sonner"; // To show notifications
import { useAuth } from "../../context/AuthContext";

const UserProfile = () => {
  const { id } = useParams(); // id is the user ID of the profile being viewed
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/profile/${id}`);
        console.log("profile", res?.data);
        setUserProfile(res?.data);
        setIsFollowing(res?.data.followers.includes(currentUser?._id)); // Check if the current user is already following the profile user
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [id, currentUser?._id]);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/users/follow/${id}`);
      setIsFollowing(true);
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        followers: [...prevProfile.followers, currentUser?._id],
      })); // Update followers list in the user profile
      toast.success("User followed successfully!");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.post(`/users/unfollow/${id}`);
      setIsFollowing(false);
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        followers: prevProfile.followers.filter(
          (follower) => follower !== currentUser?._id
        ),
      })); // Remove current user from the followers list
      toast.success("User unfollowed successfully!");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow user.");
    }
  };

  return (
    <>
      <NavBar />
      <Toaster richColors />
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
                  <span>{userProfile?.followers.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold">Following</h1>
                  <span>{userProfile?.following.length || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-x-4 pt-5">
                <img
                  src={
                    userProfile?.profile_picture ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex flex-col gap-y-2">
                  <span className="text-xl font-semibold">{userProfile?.fullname}</span>
                  <div>
                    {currentUser?._id !== id && (
                      <button
                        onClick={isFollowing ? handleUnfollow : handleFollow}
                        className={`px-6 py-1 rounded-md font-medium text-white ${
                          isFollowing
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-purple-500 hover:bg-purple-600"
                        }`}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Full name
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.fullname}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Email address
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.email}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Phone Number
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {userProfile?.phone_number}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
