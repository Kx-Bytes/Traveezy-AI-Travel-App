import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Building, MapPin, DollarSign, Star } from 'lucide-react';
import { GetPlaceDetails } from '@/service/GlobalAPI';
import { PHOTO_URL } from '@/service/GlobalAPI';

const HotelCard = ({ hotel }) => {
    const [PhotoURL, setPhotoURL] = useState('/placeholder.jpg');
    const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

    useEffect(() => {
        if (hotel) {
            console.log(hotel)
            GetPlacePhoto();
        }
    }, [hotel]);

    const GetPlacePhoto = async () => {
        if (!hotel?.hotelName) return; // Ensure hotelName exists
        const data = { textQuery: hotel.hotelName  };

        try {
            const resp = await GetPlaceDetails(data);
            console.log('API Response:', resp.data); // Debug the API response

            if (resp.data?.places?.[0]?.photos?.length > 0) {
                const photoName = resp.data.places[0].photos[0].name; // Use the first photo as a fallback
                const newPhotoURL = PHOTO_URL.replace('{NAME}', photoName);
                setPhotoURL(newPhotoURL);
            } else {
                console.warn('No photos available for this hotel.');
            }
        } catch (error) {
            console.error('Error fetching photo:', error);
        }
    };

    // Helper function to get the currency symbol
    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case 'USD':
                return '$';
            case 'INR':
                return '₹';
            case 'EUR':
                return '€';
            default:
                return currency; // Fallback to the currency code if no symbol is found
        }
    };

    return (
        <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelAddress)},${encodeURIComponent(hotel.hotelName)}`}
            target="_blank"
        >
            <div className="border p-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl relative">
                <img
                    src={PhotoURL ?? "/GREECE.jpg"}
                    alt={hotel.hotelName}
                    className="rounded-2xl w-full h-40 object-cover"
                />
                <div className="my-2 flex flex-col gap-2.5">
                    <h3 className="font-bold flex items-center gap-2">
                        <Building size={18} /> {hotel.hotelName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2 relative group">
                        <MapPin size={16} className="text-red-500" /> {hotel.hotelAddress}
                        <span className="absolute left-0 -bottom-6 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for directions
                        </span>
                    </p>
                    <p className="text-xs font-bold flex items-center gap-2 relative group">
                        <span size={16} className="text-green-500" /> {getCurrencySymbol(hotel.currencyType)}{hotel.price}
                        <span className="absolute left-0 -bottom-6 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Per night stay
                        </span>
                    </p>
                    <p className="flex items-center gap-2 relative group">
                        <Star size={16} className="text-yellow-500" /> {hotel.rating}
                        <span className="absolute left-0 -bottom-6 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            User rating
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
};

HotelCard.propTypes = {
    hotel: PropTypes.shape({
        hotelName: PropTypes.string.isRequired,
        hotelAddress: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        currencyType: PropTypes.string.isRequired, // Add currency to PropTypes
    }).isRequired,
};

export default HotelCard;