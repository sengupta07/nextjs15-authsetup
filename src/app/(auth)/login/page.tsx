"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextLoader } from "@/app/common/components/Loader";
import ResizablePanel from "@/app/common/components/ResizablePanel";
import { setAuthCookie } from "@/lib/auth";
import router from "next/router";

type LoginInputs = {
  username: string;
  password: string;
};

type RequestAccessInputs = {
  email: string;
};

type UniversalErrorState = {
  type: "login" | "access";
  message: string;
};

export default function LoginPage() {
  const [universalError, setUniversalError] =
    useState<UniversalErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestAccess, setShowRequestAccess] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginInputs>();

  const {
    register: registerAccess,
    handleSubmit: handleAccessSubmit,
    formState: { errors: accessErrors },
    reset: resetAccessForm,
  } = useForm<RequestAccessInputs>();

  const onLoginSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setIsLoading(true);
    setUniversalError(null);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAuthCookie(result.accessToken);
        router.push("/welcome");
      } else {
        const errorData = await response.json();
        setUniversalError({
          type: "login",
          message: errorData.message || "Login failed",
        });
      }
    } catch (err) {
      setUniversalError({
        type: "login",
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onAccessRequestSubmit: SubmitHandler<RequestAccessInputs> = async (
    data
  ) => {
    setIsLoading(true);
    setUniversalError(null);

    try {
      const response = await fetch("https://dummyjson.com/api/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        resetAccessForm();
        router.push("/access-requested");
      } else {
        const errorData = await response.json();
        setUniversalError({
          type: "access",
          message: errorData.message || "Failed to send access request",
        });
      }
    } catch (err) {
      setUniversalError({
        type: "access",
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRequestAccess = () => {
    setShowRequestAccess(!showRequestAccess);
    setUniversalError(null);
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="bg-white overflow-hidden p-8 space-y-4 rounded-xl shadow-md w-96"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 text-2xl font-bold text-center"
          >
            Login
          </motion.h2>

          {/* Universal Error Handling */}
          <ResizablePanel>
            {universalError && (
              <motion.div
                key="universal-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                  p-3 rounded mb-4 
                  ${
                    universalError.type === "login"
                      ? "bg-red-100 text-red-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {universalError.message}
              </motion.div>
            )}
          </ResizablePanel>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <label htmlFor="username" className="block mb-2 text-sm">
                Username
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                }}
                id="username"
                type="text"
                {...registerLogin("username", {
                  required: "Username is required",
                })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ResizablePanel>
                {loginErrors.username && (
                  <motion.p
                    key="username-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {loginErrors.username.message}
                  </motion.p>
                )}
              </ResizablePanel>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <label htmlFor="password" className="block mb-2 text-sm">
                Password
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                }}
                id="password"
                type="password"
                {...registerLogin("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ResizablePanel>
                {loginErrors.password && (
                  <motion.p
                    key="password-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {loginErrors.password.message}
                  </motion.p>
                )}
              </ResizablePanel>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Login
            </motion.button>
          </form>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleRequestAccess}
              className="text-blue-500 hover:underline"
            >
              {showRequestAccess ? "Cancel" : "Request Temporary Access"}
            </motion.button>
          </motion.div>

          <ResizablePanel>
            {showRequestAccess && (
              <motion.div
                key="request-access"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleAccessSubmit(onAccessRequestSubmit)}>
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
                      {...registerAccess("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ResizablePanel>
                      {accessErrors.email && (
                        <motion.p
                          key="email-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {accessErrors.email.message}
                        </motion.p>
                      )}
                    </ResizablePanel>
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
                </form>
              </motion.div>
            )}
          </ResizablePanel>
        </motion.div>
      </motion.div>
    </>
  );
}
