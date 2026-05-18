import MainLayout
from "../layouts/MainLayout";

export default function NotFound() {

  return (
    <MainLayout>

      <div
        className="
        h-[70vh]
        flex
        flex-col
        items-center
        justify-center
        "
      >

        <h1
          className="
          text-7xl
          font-bold
          text-red-600
          mb-6
          "
        >
          404
        </h1>

        <p className="text-2xl">
          Page introuvable
        </p>

      </div>

    </MainLayout>
  );
}