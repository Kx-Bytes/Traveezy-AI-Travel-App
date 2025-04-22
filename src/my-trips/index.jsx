import { db } from '@/service/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserTripCard from './components/UserTripCard';

const My_Trips = () => {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(true); // New loading state

    useEffect(() => {
        Getusertrips();
    }, []);

    const Getusertrips = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.email) {
                console.log("No user found. Redirecting...");
                navigate('/');
                return;
            }

            const q = query(collection(db, "AItrips"), where("userEmail", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No trips found for this user.");
                setUserTrips([]);
                return;
            }
            
            const tripsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserTrips(tripsArray);
        } catch (error) {
            console.error("Error fetching user trips:", error);
        } finally {
            setIsLoading(false); // Stop loading after fetching
        }
    };

    return (
        <div className='sm:px-10 md:px-9 lg:px-36 xl:px-44 px-5 mt-28 text-gray-900'>
            <h2 className='font-bold text-3xl'>My Trips</h2>
            <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
                {isLoading ? (
                    // Skeleton Loader
                    [...Array(6)].map((_, index) => (
                        <div key={index} className="animate-pulse space-y-4 p-4 border rounded-lg">
                            <div className="w-full h-40 bg-gray-300 rounded-lg"></div>
                            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                        </div>
                    ))
                ) : (
                    userTrips.map((tripData, index) => (
                        <UserTripCard key={index} tripData={tripData} />
                    ))
                )}
            </div>
        </div>
    );
};

export default My_Trips;