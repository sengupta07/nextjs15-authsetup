"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TextLoader } from "@/app/common/components/Loader";

type RequestAccessInputs = {
  email: string;
};

export default function RequestAccessPage() {
  const router = useRouter();
  const [requestStatus, setRequestStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestAccessInputs>();

  const onSubmit: SubmitHandler<RequestAccessInputs> = async (data) => {
    setIsLoading(true);
    setRequestStatus(null);

    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Simulate a slight delay to show loading state
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.ok) {
        setRequestStatus({
          type: "success",
          message: "Temporary access email sent successfully!",
        });
      } else {
        const errorData = await response.json();
        setRequestStatus({
          type: "error",
          message: errorData.message || "Failed to send access request",
        });
      }
    } catch (err) {
      setRequestStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <TextLoader
          messages={["Loading", "Fetching Data", "Almost Ready"]}
          interval={2000}
          dotCount={3}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-900"
      >
        <motion.form
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-md w-96"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 text-2xl font-bold text-center"
          >
            Request Temporary Access
          </motion.h2>

          <AnimatePresence>
            {requestStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded mb-4 overflow-hidden ${
                  requestStatus.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {requestStatus.message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <label htmlFor="email" className="block mb-2 text-sm">
              Email
            </label>
            <motion.input
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
              }}
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Request Access
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-500 hover:underline"
            >
              Already have access? Go to Login
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </>
  );
}
