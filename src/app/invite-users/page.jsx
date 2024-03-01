"use client";
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import useApiHook from "@/hooks/useApiHook";
import { sendEmailSchema } from "@/schema/auth/authSchema";
import { RotatingLines } from "react-loader-spinner";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";

const Page = () => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [emails, setEmails] = useState([]);
  const [emailStatuses, setEmailStatuses] = useState({});
  const [individual, setInvidual] = useState(true);
  const [bulk, setBulk] = useState(false);
  const fileInputRef = useRef(null);

  const handleSendEmail = () => {
    setInvidual(!individual);
    setBulk(!bulk);
  };

  const handleSubmit = async (values) => {
    try {
      let emails;
      if (values.email) {
        emails = [values.email];
      } else {
        emails = values.map((item) => item.email);
      }
      const result = await handleApiCall({
        method: "post",
        url: "/auth/admin/sign-up-email",
        data: { emails },
      });
      // Update email status after sending email
      if (result.status === 200) {
        console.log(result);
        const newArr = [];
        const newArr2 = [];
        const newArr3 =[]
        result?.data?.sendEmails?.map((email) => {
          const findEmail = emails.find((item) => item.email === email);
          newArr.push({
            email: findEmail.email,
            status: "Sent",
          });
        });
        result?.data?.alreadyExists?.map((email) => {
          const findEmail = emails.find((item) => item.email === email);
          newArr.push({
            email: findEmail.email,
            status: "Already Exists",
          });
        });
        result?.data?.emailsNotExist?.map((email) => {
          const findEmail = emails.find((item) => item.email === email);
          newArr.push({
            email: findEmail.email,
            status: "Already Not Exists",
          });
        });
        const finalArr = [...newArr, ...newArr2, ...newArr3];
        setEmails(finalArr);
        toast.success(result?.data?.message);
      }
    } catch (err) {
      console.log("error", err);
      toast.error(err?.message);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const findEmailColumn = (data) => {
    for (let i = 0; i < data[0].length; i++) {
      const cell = data[0][i].toString().toLowerCase();
      if (cell.includes("email")) {
        return i;
      }
    }
    return -1;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const chunkSize = 1024 * 1024;

    let offset = 0;
    let parsedEmails = [];
    let count = 0; // Counter for number of records processed

    const processChunk = async () => {
      const chunk = file.slice(offset, offset + chunkSize);
      const text = await chunk.text();

      const parsedChunk = Papa.parse(text, {
        header: false,
      });
      const emailColumnIndex = findEmailColumn(parsedChunk.data);
      if (emailColumnIndex !== -1) {
        const chunkEmails = parsedChunk.data
          .slice(1)
          .map((row) => row[emailColumnIndex]);
        parsedEmails = parsedEmails.concat(chunkEmails);
      }

      offset += chunkSize;
      count += parsedEmails.length;

      // Stop processing if more than 100 records have been fetched
      if (count >= 100) {
        parsedEmails = parsedEmails.slice(0, 100);
        const emailData = parsedEmails.map((email) => ({
          email,
          status: "unsent",
        }));
        setEmails(emailData);
        return;
      }

      if (offset < file.size) {
        await processChunk();
      } else {
        setEmails(parsedEmails);
        // Initialize email statuses
        const statusObj = {};
        parsedEmails.forEach((email) => {
          statusObj[email] = "pending";
        });
        setEmailStatuses(statusObj);
      }
    };

    await processChunk();
  };
  console.log(emails)
  return (
    <>
      <div className="p-2.5 pt-4 md:pt-10 max-w-screen-3xl h-fu w-full m-auto flex flex-col min-w-80 z-10 text-white">
        <div className="flex justify-between mb-2 md:mb-5 px-3 md:px-10">
          <div className="flex text-sm p-1.5 lightGrayBg leading-8 rounded-md">
            <button
              className={`${
                individual && "darkGrayBg"
              } px-4 mr-2 rounded-md text-sm transition-all ease-in-out`}
              onClick={handleSendEmail}
            >
              Individual
            </button>
            <button
              className={`${
                bulk && "darkGrayBg"
              } px-4 mr-2 rounded-md text-sm  transition-all ease-in-out`}
              onClick={handleSendEmail}
            >
              Bulk
            </button>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-center max-w-[37rem] screenHeightForEmail m-auto px-5 md:px-0">
        <div className="relative overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white px-3 py-5 md:p-8 charcoalBg rounded-2xl border border-gray-100">
          <p className="md:text-6xl text-base font-bold pt-0 md:pt-5 text-center max-w-[20.5rem] m-auto leading-6 md:leading-8">
            {individual ? "Invite individual user" : "Invite bulk users"}
          </p>
          {individual ? (
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={sendEmailSchema}
              onSubmit={handleSubmit}
            >
              <Form className="w-full text-white text-sm md:text-base pt-2 md:pt-4 z-10 relative">
                <div className="w-full block">
                  <div className="w-full sm:w-full">
                    <label className="w-full block pt-2 pb-3">
                      Email<span className="text-red-600"> *</span>
                    </label>
                    <Field
                      name="email"
                      placeholder="Enter email here"
                      className="email mb-2 text-gray-700 text-base w-full leading-3 md:leading-5  py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>
                <div className="w-full pt-4">
                  <button
                    type="submit"
                    disabled={isApiLoading}
                    className="btn-login btn-Gradient text-base text-black w-full leading-3 md:leading-5 py-3 md:py-4 text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center"
                  >
                    {isApiLoading ? (
                      <RotatingLines
                        visible={true}
                        height="14"
                        width="14"
                        color="blue"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    ) : (
                      <p>Send</p>
                    )}
                  </button>
                </div>
              </Form>
            </Formik>
          ) : (
            <div className="w-full mt-10">
              <div className="flex flex-col items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button onClick={openFileDialog} className="m-auto w-full">
                  <img
                    src="/assets/images/auth/upload.png"
                    alt="upload"
                    className="w-28 h-28 mx-auto cursor-pointer"
                  />
                  <p className="pt-5">Upload invites here...</p>
                </button>
                {bulk && emails.length > 0 && (
                  <div className="rounded-2xl my-4 max-w-[37rem] max-h-[15rem] mx-auto overflow-x-auto ">
                    <table className="text-white table-fixed w-full border border-gray-100" >
                      <thead>
                        <tr className="">
                          <th className=" px-4 py-2">
                            Email
                          </th>
                          <th className="border-l border-gray-100 px-4 py-2">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.map((item, index) => (
                          <tr key={index}  className="border border-gray-100">
                            <td className="text-center px-4 py-2" style={{ height: "3.5rem" }}>
                              {item?.email}
                            </td>
                            <td className="flex justify-center items-center border-l border-gray-100 px-4 py-2" style={{ height: "3.5rem" }}>
                              {isApiLoading ? (
                                <RotatingLines
                                  visible={true}
                                  height="14"
                                  width="14"
                                  color="blue"
                                  strokeWidth="5"
                                  animationDuration="0.75"
                                  ariaLabel="rotating-lines-loading"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                />
                              ) : (
                                item?.status
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="w-full pt-4">
                  <button
                    onClick={() => handleSubmit(emails)}
                    disabled={emails.length === 0 || isApiLoading}
                    className="btn-login btn-Gradient text-base text-black w-full leading-3 md:leading-5 py-3 md:py-4 text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center"
                  >
                    {isApiLoading ? (
                      <RotatingLines
                        visible={true}
                        height="14"
                        width="14"
                        color="blue"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    ) : (
                      <p>Send</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10"></div>
    </>
  );
};

export default Page;
