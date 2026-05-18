import { Link } from "react-router-dom";

export default function Sidebar() {

  return (

    <div className="
    w-72
    min-h-screen
    bg-blue-950
    text-white
    p-6
    shadow-2xl
    ">

      <h1 className="
      text-3xl
      font-extrabold
      mb-12
      text-center
      ">
        ADMIN UDM
      </h1>

      <nav className="
      flex
      flex-col
      gap-4
      ">

        <Link
          to="/admin/dashboard"
          className="
          bg-blue-800
          hover:bg-blue-700
          p-4
          rounded-2xl
          transition
          font-semibold
          "
        >
          Dashboard
        </Link>

        <Link
          to="/admin/admissions"
          className="
          bg-blue-800
          hover:bg-blue-700
          p-4
          rounded-2xl
          transition
          font-semibold
          "
        >
          Admissions
        </Link>

        <Link
          to="/"
          className="
          bg-red-700
          hover:bg-red-600
          p-4
          rounded-2xl
          transition
          font-semibold
          mt-10
          "
        >
          Retour Site
        </Link>

      </nav>

    </div>

  );

}