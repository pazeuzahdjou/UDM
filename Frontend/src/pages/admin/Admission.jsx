import { useEffect, useState }

from "react";



export default function Admissions() {

  const [admissions,setAdmissions]
  = useState([]);

  // =========================
  // CHARGER ADMISSIONS
  // =========================
  async function fetchAdmissions(){

    try{

      const response =
      await fetch(

        "http://localhost:5000/api/admission"
      );

      const data =
      await response.json();

      setAdmissions(data);

    }

    catch(error){

      console.log(error);

    }

  }

  useEffect(()=>{

    fetchAdmissions();

  },[]);

  // =========================
  // SUPPRIMER
  // =========================
  async function supprimer(id){

    try{

      await fetch(

        `http://localhost:5000/api/admission/${id}`,

        {
          method:"DELETE"
        }

      );

      fetchAdmissions();

    }

    catch(error){

      console.log(error);

    }

  }

  return (

    <AdminLayout>

      <h1 className="
      text-5xl
      font-extrabold
      mb-10
      text-blue-950
      ">
        Liste des admissions
      </h1>

      <div className="
      overflow-x-auto
      bg-white
      rounded-3xl
      shadow-2xl
      p-6
      ">

        <table className="
        w-full
        border-collapse
        ">

          <thead>

            <tr className="
            bg-blue-950
            text-white
            ">

              <th className="p-4">
                Nom
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Filière
              </th>

              <th className="p-4">
                Niveau
              </th>

              <th className="p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {admissions.map((item)=>(

              <tr
                key={item._id}
                className="
                border-b
                hover:bg-gray-100
                "
              >

                <td className="p-4">
                  {item.nom}
                </td>

                <td className="p-4">
                  {item.email}
                </td>

                <td className="p-4">
                  {item.filiere}
                </td>

                <td className="p-4">
                  {item.niveau}
                </td>

                <td className="p-4">

                  <button
                    onClick={()=>
                    supprimer(item._id)
                    }
                    className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    "
                  >
                    Supprimer
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  );

}