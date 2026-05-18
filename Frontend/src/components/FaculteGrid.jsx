import { facultes }
from "../data/formations";

import FormationCard
from "./FormationCard";

export default function FaculteGrid() {

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-10
      "
    >

      {
        facultes.map((item) => (

          <FormationCard
            key={item.id}
            item={item}
          />

        ))
      }

    </div>
  );
}