import React, { useEffect, useState, useMemo } from "react";
import { GetPlaceDetails } from "@/service/GlobalAPI";
import { PHOTO_URL } from "@/service/GlobalAPI";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UserTripCard = ({ tripData }) => {
    const [PhotoURL, setPhotoURL] = useState();

    // Use useMemo to memoize parsedTripData
    const parsedTripData = useMemo(() => {
        try {
            return JSON.parse(tripData.tripData);
        } catch (error) {
            console.error("Error parsing tripData:", error);
            return null;
        }
    }, [tripData.tripData]);

    useEffect(() => {
        console.log("useEffect triggered with parsedTripData:", parsedTripData);

        if (parsedTripData?.tripName) {
            GetPlacePhoto();
        }
    }, [parsedTripData]);

    const GetPlacePhoto = async () => {
        if (!parsedTripData?.tripName) {
            console.log("tripName is missing in parsedTripData:", parsedTripData);
            return;
        }

        console.log("Fetching place details for:", parsedTripData.tripName);
        const data = { textQuery: parsedTripData.tripName };

        try {
            const resp = await GetPlaceDetails(data);
            console.log("API Response:", resp.data);

            if (resp.data?.places?.[0]?.photos?.length > 0) {
                const photoName = resp.data.places[0].photos[0].name;
                const newPhotoURL = PHOTO_URL.replace('{NAME}', photoName);
                console.log("Setting PhotoURL to:", newPhotoURL);
                setPhotoURL(newPhotoURL);
            } else {
                console.log("No photos available in response.");
            }
        } catch (error) {
            console.error("Error in GetPlacePhoto:", error);
        }
    };

    if (!parsedTripData) {
        return <div className="text-center text-lg font-medium text-gray-700">Loading...</div>;
    }

    return (
        <Link to={'/view-trip/' + tripData?.id}>
            <div>
                <img
                    src={PhotoURL ?? "/GREECE.jpg"}
                    alt={parsedTripData?.tripName || "Trip Image"}
                    className="rounded-xl object-cover w-full h-48"
                />
                <div className="object-cover rounded-xl">
                    <h2 className="font-bold text-xl">
                        {tripData?.userSelection?.location?.address || "Unknown Location"}
                    </h2>
                    <div className="text-sm my-1 text-gray-600">
                        {tripData?.userSelection?.NumberofDays || "N/A"} Days trip with {tripData?.userSelection?.budget || "N/A"} Budget
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Define propTypes for UserTripCard
UserTripCard.propTypes = {
    tripData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        tripData: PropTypes.string.isRequired, // tripData is a stringified JSON
        userSelection: PropTypes.shape({
            location: PropTypes.shape({
                address: PropTypes.string,
            }),
            NumberofDays: PropTypes.string,
            budget: PropTypes.string,
        }),
    }).isRequired,
};

export default UserTripCard;