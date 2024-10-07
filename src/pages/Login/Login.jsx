import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path as needed
import { toast, Toaster } from "sonner";
import Footer from "../../components/Footer";
import axiosInstance from "../../utils/axiosInstance";

export default function Login() {
  const { user, setUser, setTotalEarnings } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/users/login", values);
        console.log(response?.data);
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user?._id);
        setTotalEarnings(user?.total_earnings);
        setUser(user);
        toast.success("Login Successful");
        setTimeout(() => {
          navigate("/events");
        }, 1000);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full">
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Login to your account
                </h2>
              </div>
              <div className="mt-10">
                <div>
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Link
                          to="/register"
                          className="block text-sm leading-6 text-gray-700 hover:underline cursor-pointer"
                        >
                          Don't have an account?
                        </Link>
                      </div>
                      <div className="text-sm leading-6">
                        <Link
                          to="/register"
                          className="font-semibold text-purple-600 hover:text-purple-500"
                        >
                          Register Now
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      >
                        {loading ? "Loading..." : "Sign in"}
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
