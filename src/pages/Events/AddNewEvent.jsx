import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../utils/firebaseConfig";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axiosInstance from "../../utils/axiosInstance";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { FaCalendar } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function AddNewEvent() {
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      event_title: "",
      category: "",
      event_date_and_time: null,
      event_address: "",
      additional_info: "",
      ticket_price: "",
      event_description: "",
      event_max_capacity: "",
      event_video: null,
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category is required"),
      event_date_and_time: Yup.date().required(
        "Event date and time are required"
      ),
      event_address: Yup.string().required("Event address is required"),
      additional_info: Yup.string(),
      ticket_price: Yup.number().required("Ticket price is required"),
      event_description: Yup.string().required("Event description is required"),
      event_max_capacity: Yup.number().required(
        "Event max capacity is required"
      ),
      event_video: Yup.mixed().required("Event video is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const videoFile = values.event_video;
      const storageRef = ref(storage, `videos/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, videoFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setVideoUploadProgress(progress);
        },
        (error) => {
          console.error("Video upload failed: ", error);
          setSubmitting(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("Video available at: ", downloadURL);
            const eventData = {
              ...values,
              event_date_and_time: values.event_date_and_time.toISOString(),
              event_video: downloadURL,
            };

            axiosInstance
              .post("/events/create", eventData)
              .then((response) => {
                console.log("Event created successfully:", response.data);
                setSubmitting(false);
                toast.success("Event created successfully");
                setTimeout(() => {
                  navigate("/events");
                }, 500);
              })
              .catch((error) => {
                console.error("Event creation failed:", error);
                setSubmitting(false);
                toast.error("Event creation failed");
              });
          });
        }
      );
    },
  });

  const handleVideoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("event_video", file);
      const fileURL = URL.createObjectURL(file);
      setVideoPreview(fileURL);
    }
  };

  const categories = ["Concert", "Conference", "Workshop", "Meetup", "Party"];

  return (
    <div>
      <Toaster richColors />
      <NavBar />
      <div className="pt-24 lg:px-0 px-3 w-full lg:hidden md:hidden">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-4xl mx-auto flex flex-col gap-y-4"
        >
          <div className="w-full">
            <div className="flex flex-col items-start gap-y-3">
              <Link
                to="/events"
                className="text-sm text-gray-700 hover:text-gray-500 flex items-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                Back
              </Link>
              <h2 className="text-xl font-semibold leading-7 text-gray-900">
                Event Information
              </h2>
              <div className="w-full pt-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="event_title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="event_title"
                      name="event_title"
                      type="text"
                      {...formik.getFieldProps("event_title")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.event_title && formik.errors.event_title ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.event_title}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2">
                    <select
                      id="category"
                      name="category"
                      {...formik.getFieldProps("category")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    >
                      <option value="" label="Select category" />
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.category}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="event_date_and_time"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Date and Time
                  </label>
                  <div className="mt-2">
                    <DatePicker
                      id="event_date_and_time"
                      name="event_date_and_time"
                      value={formik.values.event_date_and_time}
                      onChange={(date) =>
                        formik.setFieldValue("event_date_and_time", date)
                      }
                      caretAs={FaCalendar}
                      showMeridian
                      format="dd MMM yyyy hh:mm:ss aa"
                      className="w-full"
                    />
                    {formik.touched.event_date_and_time &&
                    formik.errors.event_date_and_time ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.event_date_and_time}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="event_address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="event_address"
                      name="event_address"
                      type="text"
                      {...formik.getFieldProps("event_address")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.event_address &&
                    formik.errors.event_address ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.event_address}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="additional_info"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Additional Info
                  </label>
                  <div className="mt-2">
                    <input
                      id="additional_info"
                      name="additional_info"
                      type="text"
                      {...formik.getFieldProps("additional_info")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.additional_info &&
                    formik.errors.additional_info ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.additional_info}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="ticket_price"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Ticket Price
                  </label>
                  <div className="mt-2">
                    <input
                      id="ticket_price"
                      name="ticket_price"
                      type="number"
                      {...formik.getFieldProps("ticket_price")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.ticket_price &&
                    formik.errors.ticket_price ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.ticket_price}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="event_description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="event_description"
                      name="event_description"
                      rows={3}
                      {...formik.getFieldProps("event_description")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.event_description &&
                    formik.errors.event_description ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.event_description}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="event_max_capacity"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Max Capacity
                  </label>
                  <div className="mt-2">
                    <input
                      id="event_max_capacity"
                      name="event_max_capacity"
                      type="number"
                      {...formik.getFieldProps("event_max_capacity")}
                      className="block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.event_max_capacity &&
                    formik.errors.event_max_capacity ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.event_max_capacity}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="event_video"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Video
                  </label>
                  <div className="mt-2 flex flex-col justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <input
                        id="event_video"
                        name="event_video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="event_video"
                        className="relative cursor-pointer rounded-md bg-purple-500 font-semibold text-white p-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:bg-purple-600"
                      >
                        <span>Upload a video</span>
                      </label>
                      {formik.touched.event_video &&
                      formik.errors.event_video ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.event_video}
                        </div>
                      ) : null}
                    </div>
                    {videoPreview && (
                      <div className="mt-4">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    {videoUploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                        <div
                          className="bg-purple-500 h-4 rounded-full"
                          style={{ width: `${videoUploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
