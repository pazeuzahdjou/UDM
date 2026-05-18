import AdminLayout
from "../../layouts/admin/AdminLayout";

export default function Dashboard() {

  return (

    <AdminLayout>

      <h1 className="
      text-5xl
      font-extrabold
      mb-12
      text-blue-950
      ">
        Tableau de bord
      </h1>

      <div className="
      grid
      md:grid-cols-3
      gap-8
      ">

        {/* CARD 1 */}
        <div className="
        bg-white
        rounded-3xl
        p-8
        shadow-xl
        ">

          <h2 className="
          text-xl
          font-bold
          text-gray-600
          ">
            Total Admissions
          </h2>

          <p className="
          text-5xl
          font-extrabold
          mt-4
          text-blue-900
          ">
            120
          </p>

        </div>

        {/* CARD 2 */}
        <div className="
        bg-white
        rounded-3xl
        p-8
        shadow-xl
        ">

          <h2 className="
          text-xl
          font-bold
          text-gray-600
          ">
            Étudiants
          </h2>

          <p className="
          text-5xl
          font-extrabold
          mt-4
          text-green-700
          ">
            80
          </p>

        </div>

        {/* CARD 3 */}
        <div className="
        bg-white
        rounded-3xl
        p-8
        shadow-xl
        ">

          <h2 className="
          text-xl
          font-bold
          text-gray-600
          ">
            Formations
          </h2>

          <p className="
          text-5xl
          font-extrabold
          mt-4
          text-red-700
          ">
            15
          </p>

        </div>

      </div>

    </AdminLayout>

  );

}