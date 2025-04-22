import React from "react";
import PropTypes from "prop-types";
import HotelCard from "./HotelCard";

const Hotels = ({ tripData }) => {
    if (!tripData) {
        return <div>Loading...</div>;
    }

    let parsedTripData;

    try {
        parsedTripData = typeof tripData === "string" ? JSON.parse(tripData) : tripData;
    } catch (error) {
        console.error("Error parsing tripData:", error);
        return <div>Error loading trip data.</div>;
    }

    return (
        <div>
            <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mt-10 drop-shadow-lg my-4">
                Hotel Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 hover:cursor-pointer">
                {parsedTripData?.hotels?.map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    );
};

Hotels.propTypes = {
    tripData: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            hotels: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    location: PropTypes.string,
                    price: PropTypes.number,
                    imageUrl: PropTypes.string,
                })
            )
        })
    ]),
};

export default Hotels;