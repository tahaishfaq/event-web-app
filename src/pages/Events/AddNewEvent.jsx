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
import PlacesAutocomplete from "react-places-autocomplete";
import { FiMapPin } from "react-icons/fi";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

export default function AddNewEvent() {
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [uploadTask, setUploadTask] = useState(null);
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
      age_restriction: [], // New field for age restriction
      gender_restriction: [], // New field for gender restriction
    },
    validationSchema: Yup.object({
      event_title: Yup.string().required("Event title is required"),
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
      const newUploadTask = uploadBytesResumable(storageRef, videoFile);
      setUploadTask(newUploadTask);

      newUploadTask.on(
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
          getDownloadURL(newUploadTask.snapshot.ref).then((downloadURL) => {
            const eventData = {
              ...values,
              event_address: {
                address: address,
                longitude: coordinates.lng,
                latitude: coordinates.lat,
              },
              event_date_and_time: values.event_date_and_time.toISOString(),
              event_video: downloadURL,
            };

            axiosInstance
              .post("/events/create", eventData)
              .then((response) => {
                setSubmitting(false);
                toast.success("Event created successfully");
                setTimeout(() => {
                  navigate("/events");
                }, 500);
              })
              .catch((error) => {
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

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
    formik.setFieldValue("event_address", value);
  };

  const handleCancel = () => {
    if (uploadTask) {
      uploadTask.cancel();
      toast.error("You have canceled the submission.");
    }
    formik.resetForm();
    setVideoUploadProgress(0);
    setVideoPreview(null);
    setAddress("");
    setCoordinates({ lat: null, lng: null });
  };

  const categories = ["Concert", "Conference", "Workshop", "Meetup", "Party"];
  const ageOptions = ["under_18", "20s", "30s", "40_and_above"];
  const genderOptions = ["male", "female"];

  return (
    <div>
      <Toaster richColors />
      <NavBar />
      <div className="pt-32 lg:px-0 px-3 w-full ">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-4xl mx-auto flex flex-col gap-y-4"
        >
          <div className="w-full">
            <div className="flex flex-col items-start gap-y-3">
              <Link
                to="/events"
                className="text-sm text-gray-700 hover:text-gray-500 flex items-center mb-4"
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
                    <PlacesAutocomplete
                      value={address}
                      onChange={setAddress}
                      onSelect={handleSelect}
                      searchOptions={{
                        componentRestrictions: { country: ["ZA"] }, // Restrict to South Africa
                      }}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div className="w-full relative">
                          <input
                            {...getInputProps({
                              placeholder: "Search by Location",
                              className:
                                "block w-full rounded-md border-0 bg-gray-900/5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6",
                            })}
                          />
                          <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-10 max-h-60 overflow-y-auto">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion, index) => {
                              const className = suggestion.active
                                ? "cursor-pointer bg-purple-500 text-white px-4 py-2"
                                : "cursor-pointer bg-gray-100 text-black px-4 py-2";
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                  })}
                                  key={index}
                                >
                                  <div className="flex items-center">
                                    <FiMapPin className="mr-2" />
                                    {suggestion.description}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
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

                {/* Age Restriction - Use Checkboxes */}
                <div className="col-span-full mt-2">
                  <label
                    htmlFor="age_restriction"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Age Restriction
                  </label>
                  <div className="mt-2 flex gap-x-4">
                    {ageOptions.map((age) => (
                      <label key={age} className="flex items-center">
                        <input
                          type="checkbox"
                          name="age_restriction"
                          value={age}
                          checked={formik.values.age_restriction.includes(age)}
                          onChange={(e) => {
                            const selectedAges = formik.values.age_restriction;
                            if (e.target.checked) {
                              formik.setFieldValue("age_restriction", [
                                ...selectedAges,
                                age,
                              ]);
                            } else {
                              formik.setFieldValue(
                                "age_restriction",
                                selectedAges.filter((item) => item !== age)
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        {age}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender Restriction - Use Radio Buttons */}
                <div className="col-span-full mt-2">
                  <label
                    htmlFor="gender_restriction"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Gender Restriction
                  </label>
                  <div className="mt-2 flex gap-x-4">
                    {genderOptions.map((gender) => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="radio"
                          name="gender_restriction"
                          value={gender}
                          checked={formik.values.gender_restriction.includes(
                            gender
                          )}
                          onChange={(e) => {
                            formik.setFieldValue("gender_restriction", [
                              e.target.value,
                            ]);
                          }}
                          className="mr-2"
                        />
                        {gender}
                      </label>
                    ))}
                    {/* Option for no gender restriction */}
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender_restriction"
                        value=""
                        checked={formik.values.gender_restriction.length === 0}
                        onChange={() =>
                          formik.setFieldValue("gender_restriction", [])
                        }
                        className="mr-2"
                      />
                      No Restriction
                    </label>
                  </div>
                </div>

                <div className="col-span-full mt-2">
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

          <div className="flex items-center justify-end gap-x-6 pt-10">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-purple-500 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
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
