"use client";
import { firebaseMessaging } from "@/config/firebase/firebaseClient";
import { useDispatch } from "react-redux";
import { selectAuth, useSelector } from "@/lib";
import { getToken, onMessage } from "@firebase/messaging";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useApiHook from "@/hooks/useApiHook";
import { addNotification } from "@/lib/slices/notification/notificationSlice";
import { isMobile, isBrowser, isAndroid, isIOS } from "react-device-detect";


export default function Layout({ children }) {
  const auth = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleApiCall, isApiLoading } = useApiHook();
  let type = isMobile
    ? isAndroid ? 'android' : isIOS ? 'ios' : 'mobile' : 'web';

  const sendToken = async (token) => {
    console.log("firebase token " + token);
    const values = {
      type: type,
      token: token,
    };
    const result = await handleApiCall({
      method: "PUT",
      url: "/employee/update-firebase-token",
      data: values,
      token: auth.token,
    });
    console.log("token saved");
    console.log(result);
  };

  useEffect(() => {
    if (!auth?.isLogin) router.push("/");
  }, [auth, router]);

  useEffect(() => {
    onMessage(firebaseMessaging, (payload) => {
      try {
        console.log("CompleteObject:", payload);
        console.log("Received message Title:", payload?.notification?.title);
        console.log("Received message:", payload?.notification?.body);
        const notification = [
          {
            messageId: payload?.messageId,
            sender: payload?.from,
            title: payload?.notification?.title,
            message: payload?.notification?.body,
            jobId: payload?.data?.jobId,
            isRead: false,
            createdAt: Date.now(),
          },
        ];
        dispatch(addNotification(notification));
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });
  }, [firebaseMessaging]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(firebaseMessaging, {
          vapidKey:
            "BFjCyzqcytxVs-yc8fg2iP19jGMcE6U5RvKL3Wv3m9el3w4-oy9CshaNmJYZtxz4IfGD3WfMqqlMVgHkScOFsVQ",
        })
          .then((currentToken) => {
            if (currentToken) {
              sendToken(currentToken);
            } else {
              console.error("No device token available.");
            }
          })
          .catch((error) => {
            console.error("Error getting device token:", error);
          });
      } else {
        console.error("Permission to receive notifications denied.");
      }
    });
  }, []);

  return auth?.isLogin ? children : null;
}
