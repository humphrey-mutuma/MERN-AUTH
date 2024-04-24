"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <main className="  h-fit min-w-96 text-lg rounded-lg p-5 border shadow-lg">
      <header>
        <h2 className="mt-2 text-center capitalize text-2xl font-bold leading-10 text-gray-900">
          Reset Password
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

          <footer>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3   font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset
            </button>
          </footer>
        </form>

        <footer className="mt-10 text-center   text-gray-500 flex items-center flex-wrap justify-between w-full p-1">
          <p> Link will be sent to your email </p>
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
