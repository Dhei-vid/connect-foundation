import Image from "next/image";

const MasonryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
      {/* Column 1 */}
      <div className="grid gap-2 md:gap-3 lg:gap-4">
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/7863754/pexels-photo-7863754.jpeg"
            alt="Impact story 1"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://sowdinitiative.org/storages/2023/11/Orphanage-in-nigeria-charity-for-orphans.jpg"
            alt="Impact story 2"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1672911734337-99b67318a340?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTl8fGJsYWNrJTIwY2hpbGRyZW4lMjBpbiUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D"
            alt="Impact story 3"
          />
        </div>
      </div>

      {/* Column 2 */}
      <div className="grid gap-2 md:gap-3 lg:gap-4">
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1722965615397-19e848c02776?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUzfHxibGFjayUyMGNoaWxkcmVuJTIwaW4lMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D"
            alt="Impact story 4"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/4866878/pexels-photo-4866878.jpeg"
            alt="Impact story"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/3818963/pexels-photo-3818963.jpeg"
            alt="Impact story"
          />
        </div>
      </div>

      {/* Column 3 */}
      <div className="hidden md:grid gap-2 md:gap-3 lg:gap-4">
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/7173474/pexels-photo-7173474.jpeg"
            alt="Impact story"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1558979107-a58878ab837b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjIxfHxibGFjayUyMGNoaWxkcmVuJTIwaW4lMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D"
            alt="Impact story"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1744973004434-e38159fe90b8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJsYWNrJTIwY2hpbGRyZW4lMjBpbiUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D"
            alt="Impact story"
          />
        </div>
      </div>

      {/* Column 4 */}
      <div className="hidden md:grid gap-2 md:gap-3 lg:gap-4">
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1582848252943-ed845eca0855?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM3fHxibGFjayUyMGNoaWxkcmVuJTIwaW4lMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D"
            alt="Impact story"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1505148359496-35d8d1ec9645?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjY1fHxibGFjayUyMGNoaWxkcmVuJTIwaW4lMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D"
            alt="Impact story"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            // src="https://images.pexels.com/photos/3277188/pexels-photo-3277188.jpeg"
            src="https://images.unsplash.com/photo-1592106680408-e7e63efbc7ba?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmxhY2slMjBjaGlsZHJlbiUyMGluJTIwc2Nob29sfGVufDB8fDB8fHww"
            alt="Impact story"
          />
        </div>
      </div>

      {/* Column 5 */}
      <div className="hidden md:grid gap-2 md:gap-3 lg:gap-4">
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1548102245-c79dbcfa9f92?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxhY2slMjBjaGlsZHJlbiUyMGluJTIwc2Nob29sfGVufDB8fDB8fHww"
            alt="Impact story 4"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/4866878/pexels-photo-4866878.jpeg"
            alt="Impact story"
          />
        </div>
        <div className="relative group overflow-hidden rounded-lg">
          <Image
            width={400}
            height={400}
            className="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/4544897/pexels-photo-4544897.jpeg"
            alt="Impact story"
          />
        </div>
      </div>
    </div>
  );
};

export default MasonryGrid;
