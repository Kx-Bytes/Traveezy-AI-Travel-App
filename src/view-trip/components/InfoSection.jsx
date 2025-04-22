import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, Users } from "lucide-react";
import { GetPlaceDetails } from "@/service/GlobalAPI";
import { PHOTO_URL } from "@/service/GlobalAPI";
import PropTypes from "prop-types";

const InfoSection = ({ tripData }) => {
  const [PhotoURL, setPhotoURL] = useState();

  useEffect(() => {
    if (tripData) {
      GetPlacePhoto();
    }
  }, [tripData]);

  const GetPlacePhoto = async () => {
    const data = { textQuery: tripData?.tripName };
    try {
      const resp = await GetPlaceDetails(data);
      if (resp.data.places[0]?.photos[1]?.name) {
        const newPhotoURL = PHOTO_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
        setPhotoURL(newPhotoURL);
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

  if (!tripData) {
    return <div className="text-center text-lg font-medium text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Image & Overlay */}
      <div className="relative w-[76vw]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-2xl z-10"></div>
        <img
          src={PhotoURL ?? "/GREECE.jpg"} // ✅ Fix fallbac
          alt="Trip"
          className="h-[50vh] w-full rounded-2xl object-cover shadow-lg transition-all duration-500 hover:scale-[1.02]"
        />

        {/* Trip Name - Overlay Text */}
        <div className="absolute bottom-5 left-5 z-20">
          <h2 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">
            {tripData?.tripName}
          </h2>
        </div>
      </div>

      {/* Trip Details */}
      <div className="my-6">
        <div className="flex flex-wrap justify-center gap-4">
          {/* Duration */}
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-lg px-5 py-3 rounded-full text-gray-700 text-sm md:text-md font-medium shadow-md hover:shadow-lg transition-all">
            <Calendar size={20} className="text-blue-500" /> {tripData?.duration}
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-lg px-5 py-3 rounded-full text-gray-700 text-sm md:text-md font-medium shadow-md hover:shadow-lg transition-all">
            <DollarSign size={20} className="text-green-500" /> {tripData?.budget}
          </div>

          {/* Travelers */}
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-lg px-5 py-3 rounded-full text-gray-700 text-sm md:text-md font-medium shadow-md hover:shadow-lg transition-all">
            <Users size={20} className="text-red-500" /> {tripData?.travelers} Travelers
          </div>
        </div>
      </div>
    </div>
  );
};

InfoSection.propTypes = {
  tripData: PropTypes.shape({
    tripName: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    budget: PropTypes.string.isRequired,
    travelers: PropTypes.number.isRequired,
  }).isRequired,
};

export default InfoSection;