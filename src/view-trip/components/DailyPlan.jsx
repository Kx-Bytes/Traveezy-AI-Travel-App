import React from "react";
import PropTypes from "prop-types";
import { FaClock } from "react-icons/fa";
import DailyPlanCard from "./DailyPlanCard";

const DailyPlan = ({ tripData }) => {
    if (!tripData || !tripData.itinerary) return <div>No itinerary found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-2xl p-3 mt-10">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mt-10 drop-shadow-lg">
                Daily Itinerary ✈️
            </div>
            <div className="space-y-10 mt-6 max-w-5xl mx-auto">
                {Object.entries(tripData.itinerary).map(([day, details]) => (
                    <div
                        key={day}
                        className="bg-white/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                            📍 {day.toUpperCase()} - {details.theme}
                        </h2>
                        <p className="text-gray-700 mt-1 flex items-center gap-2">
                            <FaClock className="text-blue-500" /> Best time to visit:{" "}
                            <span className="font-medium">{details.bestTimeToVisit}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                            {details.locations.map((location, index) => (
                                <DailyPlanCard key={index} location={location} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

DailyPlan.propTypes = {
    tripData: PropTypes.shape({
        itinerary: PropTypes.objectOf(
            PropTypes.shape({
                theme: PropTypes.string.isRequired,
                bestTimeToVisit: PropTypes.string.isRequired,
                locations: PropTypes.arrayOf(
                    PropTypes.shape({
                        name: PropTypes.string,
                        description: PropTypes.string,
                        imageUrl: PropTypes.string,
                        timeToSpend: PropTypes.string,
                    })
                ).isRequired,
            })
        ).isRequired,
    }),
};

export default DailyPlan;