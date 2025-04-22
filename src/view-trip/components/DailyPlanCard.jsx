import React, { useEffect, useState } from "react";
import { FaTicketAlt, FaRoute } from "react-icons/fa";
import { GetPlaceDetails } from "@/service/GlobalAPI";
import { PHOTO_URL } from "@/service/GlobalAPI";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const DailyPlanCard = ({ location }) => {
    const [photoURL, setPhotoURL] = useState(null); // Start with null instead of undefined

    const getPlacePhoto = async () => {
        if (!location?.placeName) return;

   

        const data = { textQuery: location.placeName};

        try {
            const resp = await GetPlaceDetails(data);
            console.log("API Response for location:", location.placeName, resp.data);

            if (resp.data?.places?.[0]?.photos?.length > 0) {
                const photoName = resp.data.places[0].photos[0].name; // Use the first photo
                const newPhotoURL = PHOTO_URL.replace("{NAME}", photoName);
                console.log("Setting PhotoURL to:", newPhotoURL);
                setPhotoURL(newPhotoURL);
            } else {
                console.warn("No photos available for this place:", location.placeName);
                setPhotoURL(location?.placeImageUrl || "/GREECE.jpg");
            }
        } catch (error) {
            console.error("Error fetching photo for location:", location.placeName, error);
            setPhotoURL(location?.placeImageUrl || "/GREECE.jpg");
        }
    };

    useEffect(() => {
        console.log("DailyPlanCard useEffect triggered with location:", location);
        if (location) {
            getPlacePhoto();
        }
    }, [location]);

    return (
        <div className="border rounded-lg p-4 bg-white shadow-md transition-all duration-300 hover:shadow-xl">
            <Link to={`https://www.google.com/maps/search/?api=1&query=${location?.placeName}`} target="_blank" rel="noopener noreferrer">
                <img
                    src={photoURL ?? location?.placeImageUrl ?? "/GREECE.jpg"}
                    alt={location?.placeName || "Unknown Place"}
                    className="w-full h-48 object-cover rounded-md hover:scale-[1.03] transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/GREECE.jpg"; // Fallback if the image fails to load
                    }}
                />
            </Link>

            <h3 className="text-lg font-semibold mt-3 text-gray-900">
                <Link to={`https://www.google.com/maps/search/?api=1&query=${location?.placeName}`} target="_blank" rel="noopener noreferrer">
                    {location?.placeName || "Unknown Location"}
                </Link>
            </h3>

            <p className="text-sm text-gray-700">{location?.placeDetails || "No details available"}</p>
            <div className="text-sm mt-2 text-gray-600 flex items-center gap-2">
                <FaTicketAlt className="text-green-500" />
                <strong>Ticket:</strong> {location?.ticketPricing || "N/A"}
            </div>
            <div className="text-sm mt-1 text-gray-600 flex items-center gap-2">
                <FaRoute className="text-red-500" />
                <strong>Travel Time:</strong> {location?.timeToTravel || "N/A"}
            </div>
            <p className="text-sm text-gray-500 italic mt-1">{location?.notes || "No additional notes"}</p>
        </div>
    );
};

DailyPlanCard.propTypes = {
    location: PropTypes.shape({
        placeName: PropTypes.string.isRequired,
        placeDetails: PropTypes.string,
        placeImageUrl: PropTypes.string,
        ticketPricing: PropTypes.string,
        timeToTravel: PropTypes.string,
        notes: PropTypes.string,
    }).isRequired,
};

export default DailyPlanCard;