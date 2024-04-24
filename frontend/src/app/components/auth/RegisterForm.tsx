"use client";

import { useSession } from "@/src/app/context/sessionContext";
import { NewUserProps } from "@/src/utils/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


export default function RegisterForm() {
  const { user, isLoading, createAccount } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: NewUserProps) => {
    if (data.password !== data.confirm_password) {
      return toast.error("Password Do Not Match!");
    }
    if (data.name && data.password) {
      createAccount(data);
    } else {
      return toast.error("Something went wrong!");
    }
  };

  console.log(errors);

  return (
    <main className="  h-fit min-w-96 text-lg rounded-lg p-5 border shadow-lg">
      <header>
        <h2 className="mt-2 text-center capitalize text-2xl font-bold leading-10 text-gray-900">
          Create Your Account
        </h2>
      </header>
      <br />
      <section className="  w-full ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          action="#"
          method="POST"
        >
          <div>
            <label
              htmlFor="name"
              className="block font-medium leading-6 text-gray-900"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                {...register("name", {
                  required: true,
                })}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:  sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:  sm:leading-6"
              />
            </div>
          </div>

          <div>
            <aside className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block   font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </aside>
            <aside className="mt-2">
              <input
                placeholder="Password"
                {...register("password", {
                  required: true,
                  maxLength: 80,
                  minLength: 5,
                })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:  sm:leading-6"
              />
            </aside>
          </div>

          <section>
            <aside className="flex items-center justify-between">
              <label
                htmlFor="confirm_password"
                className="block   font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
            </aside>
            <aside className="mt-2">
              <input
                placeholder="Confirm Password"
                {...register("confirm_password", {
                  required: true,
                  maxLength: 80,
                  minLength: 5,
                })}
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="confirm-password"
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:  sm:leading-6"
              />
            </aside>
          </section>

          <footer>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3   font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Account
            </button>
          </footer>
        </form>

        <footer className="mt-10 text-center   text-gray-500 flex items-center justify-between w-full p-1">
          <p>Already has account? </p>
          <Link
            href="/login"
            className="font-bold border border-blue-700 px-2 py-1 rounded-md uppercase text-indigo-600 hover:text-indigo-500"
          >
            Log In
          </Link>
        </footer>
      </section>
    </main>
  );
}
