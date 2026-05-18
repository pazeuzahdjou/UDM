import Sidebar from "../../components/Admin/Sidebar";

export default function AdminLayout({

  children

}) {

  return (

    <div className="
    flex
    min-h-screen
    bg-gray-100
    ">

      <Sidebar />

      <main className="
      flex-1
      p-10
      ">

        {children}

      </main>

    </div>

  );

}