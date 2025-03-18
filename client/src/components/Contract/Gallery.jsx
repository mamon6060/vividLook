import { PhotoView } from "react-photo-view";
import Containar from "../containar/Containar";
import gallery1 from "../../assets/gallery/gallery_1.webp";
import gallery2 from "../../assets/gallery/gallery_2.webp";
import gallery3 from "../../assets/gallery/gallery_3.webp";
import gallery4 from "../../assets/gallery/gallery_4.webp";
import gallery5 from "../../assets/gallery/gallery_5.webp";
import gallery6 from "../../assets/gallery/gallery_6.webp";

const Gallery = () => {
  const images = [
    {
      id: 1,
      src: `${gallery1}`,
      alt: "Image 1",
    },
    {
      id: 2,
      src: `${gallery2}`,
      alt: "Image 2",
    },
    {
      id: 3,
      src: `${gallery3}`,
      alt: "Image 3",
    },
    {
      id: 4,
      src: `${gallery4}`,
      alt: "Image 4",
    },
    {
      id: 5,
      src: `${gallery5}`,
      alt: "Image 5",
    },
    {
      id: 6,
      src: `${gallery6}`,
      alt: "Image 6",
    },
  ];

  return (
    <div>
      <Containar>
        <h1 className="text-3xl my-10 font-bold">Our Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-2">
          {images.map((image) => (
            <PhotoView key={image.id} src={image?.src}>
              <img
                src={image?.src}
                alt="company gallery photo"
                className="w-full md:w-80 h-48 object-cover"
              />
            </PhotoView>
          ))}
        </div>
      </Containar>
    </div>
  );
};

export default Gallery;
