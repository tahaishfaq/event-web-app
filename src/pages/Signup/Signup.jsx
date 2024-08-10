import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { storage } from "../../utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import axiosInstance from "../../utils/axiosInstance";

export default function Signup() {
  const { register } = useAuth();
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [frontPicture, setFrontPicture] = useState(null);
  const [backPicture, setBackPicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullname: "",
      phone_number: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      phone_number: Yup.string().required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsUploading(true);
      try {
        // Check if all images are selected
        if (!frontPicture || !backPicture || !profilePicture) {
          toast.error("Please select all required images");
          setIsUploading(false);
          return;
        }
  
        const frontPictureURL = await uploadImage(frontPicture, "frontPicture");
        const backPictureURL = await uploadImage(backPicture, "backPicture");
        const profilePicutureURL = await uploadImage(
          profilePicture,
          "profilePicture"
        );
  
        const registrationData = {
          ...values,
          dateOfBirth: dateOfBirth
            ? dateOfBirth.toISOString().split("T")[0]
            : null,
          front_picture: frontPictureURL,
          back_picture: backPictureURL,
          profile_picture: profilePicutureURL,
        };
  
        await axiosInstance
          .post("/users/register", registrationData)
          .then((res) => {
            console.log(res);
            toast.success("Registration successful");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          });
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error("Try Again! Registration failed");
      } finally {
        formik.resetForm();
        setIsUploading(false);
      }
    },
  });

  const handleFileChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = (file, folder) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function (optional)
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

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen flex items-center justify-center ">
        {" "}
        {/* lg:hidden md:hidden */}
        <div className="w-full">
          <div className="flex flex-1 flex-col justify-center px-4 pb-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Register your account
                </h2>
              </div>
              <div className="mt-5">
                <div>
                  <form onSubmit={formik.handleSubmit} className="space-y-3">
                    <div>
                      <label
                        htmlFor="profile_picture"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Front Picture
                      </label>
                      <div className="mt-2">
                        <input
                          id="profile_picture"
                          name="profile_picture"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(e, setProfilePicture)
                          }
                          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Full Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          required
                          {...formik.getFieldProps("fullname")}
                          className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 ${
                            formik.touched.fullname && formik.errors.fullname
                              ? "ring-red-500"
                              : ""
                          }`}
                        />
                        {formik.touched.fullname && formik.errors.fullname ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.fullname}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Date of Birth
                      </label>
                      <div className="mt-2">
                        <DatePicker
                          value={dateOfBirth}
                          onChange={(date) => setDateOfBirth(date)}
                          oneTap
                          placeholder="Select Date"
                          block
                          format="MM/dd/yyyy"
                          className="rs-datepicker"
                        />
                        {formik.touched.dateOfBirth &&
                        formik.errors.dateOfBirth ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.dateOfBirth}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone Number
                      </label>
                      <div className="mt-2">
                        <input
                          id="phone_number"
                          name="phone_number"
                          type="text"
                          required
                          {...formik.getFieldProps("phone_number")}
                          className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 ${
                            formik.touched.phone_number &&
                            formik.errors.phone_number
                              ? "ring-red-500"
                              : ""
                          }`}
                        />
                        {formik.touched.phone_number &&
                        formik.errors.phone_number ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.phone_number}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          {...formik.getFieldProps("email")}
                          className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 ${
                            formik.touched.email && formik.errors.email
                              ? "ring-red-500"
                              : ""
                          }`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.email}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          {...formik.getFieldProps("password")}
                          className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 ${
                            formik.touched.password && formik.errors.password
                              ? "ring-red-500"
                              : ""
                          }`}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.password}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="frontPicture"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Front Picture
                      </label>
                      <div className="mt-2">
                        <input
                          id="frontPicture"
                          name="frontPicture"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setFrontPicture)}
                          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="backPicture"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Back Picture
                      </label>
                      <div className="mt-2">
                        <input
                          id="backPicture"
                          name="backPicture"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setBackPicture)}
                          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                      <div className="flex items-center">
                        <span className="block text-sm leading-6 text-gray-700 ">
                          Already have an account?
                        </span>
                      </div>
                      <div className="text-sm leading-6">
                        <Link
                          to="/login"
                          className="font-semibold text-purple-600 hover:text-purple-500 hover:underline"
                        >
                          Login
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        disabled={isUploading}
                      >
                        {isUploading ? "Registering..." : "Sign up"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
