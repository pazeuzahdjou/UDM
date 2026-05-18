export default function FormationCard({
  item
}) {

  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-lg
      overflow-hidden
      "
    >

      <img
        src={item.image}
        className="h-52 w-full object-cover"
      />

      <div className="p-6">

        <h2 className="text-2xl font-bold mb-4">
          {item.formation}
        </h2>

        <p className="mb-2">
          Faculté : {item.nom}
        </p>

        <p className="mb-2">
          Niveau : {item.niveau}
        </p>

        <p className="mb-4">
          Durée : {item.duree}
        </p>

        <p className="text-gray-600">
          {item.description}
        </p>

      </div>

    </div>
  );
}