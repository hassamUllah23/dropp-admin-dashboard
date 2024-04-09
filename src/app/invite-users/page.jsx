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
  const [individual, setInvidual] = useState(true);
  const [bulk, setBulk] = useState(false);
  const fileInputRef = useRef(null);
  const [action, setAction] = useState(null);
  const [itemIndex, setItemIndex] = useState(null);
  console.log(emails);
  const handleSendEmail = () => {
    setInvidual(!individual);
    setBulk(!bulk);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (values, action, formAction) => {
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
      })
      .then((res) => {
        if (res.status === 200) {
          const newArr = [];
        const newArr2 = [];
        const newArr3 = [];
        res?.data?.data?.sendEmails?.map((obj) => {
          const findEmail = emails.find((item) => item === obj.email);
          newArr.push({
            email: findEmail,
            status: "Sent",
          });
        });
        console.log(res)
        res?.data?.data?.alreadyExists?.map((email) => {
          const findEmail = emails.find((item) => item === email);
          newArr2.push({
            email: findEmail,
            status: "Already Exists",
          });
        });
        res?.data?.data?.emailsSendFail?.map((email) => {
          const findEmail = emails.find((item) => item === email);
          newArr3.push({
            email: findEmail,
            status: "Failed",
          });
        });
        const finalArr = [...newArr, ...newArr2, ...newArr3];
        console.log('finlaArr', finalArr, action)
        if (action == "bulk") {
          setEmails(finalArr);
          toast.success(res?.data?.data?.message);
        } else {
          if (formAction){
            const { resetForm } = formAction
            resetForm()
          };
          if (newArr.length === 1) {
            toast.success("Email sent successfully");
          } else if (newArr2.length === 1) {
            toast.error("Email already exists");
          } else if (newArr3.length === 1) {
            toast.error("Email failed to send");
          }
        }
        }
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errors);
      });
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
    let count = 0;

    const processChunk = async () => {
      const chunk = file?.slice(offset, offset + chunkSize);
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
        setItemIndex(null);
        event.target.value = "";
        return;
      }
      console.log(offset, file.size);
      if (offset < file.size) {
        await processChunk();
      } else {
        setEmails(parsedEmails);
        // Initialize email statuses
        const statusObj = {};
        parsedEmails.forEach((email) => {
          statusObj[email] = "pending";
        });
      }
    };

    await processChunk();
  };

  const handleAdd = () => {
    setAction("add");
    setEmails([{ email: "", status: "unsent" }, ...emails]);
    setTimeout(() => {
      const newEmailInput = document.getElementById("input-email-0");
      if (newEmailInput) {
        newEmailInput.focus();
      }
    }, 0);
  };

  const handleEdit = (index, updatedEmail) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = updatedEmail;
    setEmails(updatedEmails);
  };

  const handleDelete = (index) => {
    setAction(null);
    setItemIndex(null);
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
  };

  const handleSave = () => {
    if (emails.length > 0 && emails[0].email.trim() === "") {
      setEmails(emails.slice(1));
    }
    setAction(null);
    setItemIndex(null);
  };
  return (
    <>
      <div className="p-2.5 pt-4 md:pt-10 max-w-screen-3xl w-full m-auto flex flex-col min-w-80 z-10 text-white">
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
      <div className="relative z-0 flex items-center justify-center max-w-[50rem] screenHeightForEmail m-auto px-10 md:px-4">
        <div className="relative overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white px-3 py-5 md:p-8 charcoalBg rounded-2xl border border-gray-100">
          <div className="w-full flex items-center justify-between">
            <p className="md:text-6xl text-base font-bold max-w-[20.5rem]">
              {individual ? "Invite individual user" : "Invite bulk users"}
            </p>
            {bulk && (
              <div className="flex justify-end">
                <button
                  className="cursor-pointer text-sm px-3 lightGrayBg leading-8 rounded-xl flexCenter gap-1 hover:bg-white hover:text-black"
                  onClick={handleAdd}
                >
                  <span>Add new</span>
                  <span>+</span>
                </button>
              </div>
            )}
          </div>
          {individual ? (
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={sendEmailSchema}
              onSubmit={(values, actions) => handleSubmit(values, 'individual', actions, )}
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
                <div
                  onClick={openFileDialog}
                  className="m-auto py-5 rounded-xl w-full border-2 border-dashed border-gray-100"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <img
                    src="/assets/images/auth/upload.png"
                    alt="upload"
                    className="w-20 h-20 mx-auto cursor-pointer"
                  />
                  <p className="pt-5 text-center">Upload csv file...</p>
                </div>
                {bulk && emails.length > 0 && (
                  <>
                    <div className="rounded-2xl my-4 max-w-[50rem] max-h-[20rem] mx-auto overflow-x-auto ">
                      <table className="text-white table-fixed w-full border border-gray-100">
                        <thead className="sticky top-0 btn-Gradient z-10 text-black">
                          <tr>
                            <th className="px-4 py-2">Email</th>
                            <th className="border-l border-gray-100 px-4 py-2">
                              Status
                            </th>
                            <th className="border-l border-gray-100 px-4 py-2">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {emails.map((item, index) => (
                            <tr key={index} className="border border-gray-100">
                              <td className="px-4 py-2 border-r border-gray-100 h-[3.5rem]">
                                {(action === "edit" && index === itemIndex) ||
                                (action === "add" && index === 0) ? (
                                  <input
                                    type="text"
                                    value={item.email}
                                    id={`input-email-${index}`}
                                    onChange={(e) =>
                                      handleEdit(index, {
                                        ...item,
                                        email: e.target.value,
                                      })
                                    }
                                    onBlur={handleSave}
                                    className="email mb-2 text-gray-700 text-base w-full leading-3 md:leading-5  py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200"
                                  />
                                ) : (
                                  item?.email
                                )}
                              </td>
                              <td className="flex justify-center items-center px-4 py-2 h-[3.5rem]">
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
                              <td className="border-l border-gray-100 text-center px-4 py-2 h-[3.5rem]">
                                <div className="flex gap-2 items-center justify-center">
                                  <button
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setAction("edit");
                                      setItemIndex(index);
                                      setTimeout(() => {
                                        const editedEmailInput =
                                          document.getElementById(
                                            `input-email-${index}`
                                          );
                                        if (editedEmailInput) {
                                          editedEmailInput.focus();
                                        }
                                      }, 0);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleDelete(index)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                <div className="w-full pt-4">
                  <button
                    onClick={() => handleSubmit(emails, "bulk")}
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
