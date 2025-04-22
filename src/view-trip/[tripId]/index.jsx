import { db } from '@/service/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import DailyPlan from '../components/DailyPlan';
import Footer from '../components/Footer';
import WeatherWidget from '../components/WeatherWidget';

const Viewtrip = () => {
    const {tripId}=useParams();
    const [tripData, settripData] = useState(null)
    const [location, setLocation] = useState(null);

    useEffect(() => {
      tripId&&GetTripData();
     
    }, [tripId])
    

    const GetTripData = async () => {
      console.log("Fetching trip data...");
      try {
          const tripRef = doc(db, "AItrips", tripId);
          const tripSnap = await getDoc(tripRef);
  
          if (tripSnap.exists()) {
              const data = tripSnap.data();  
              console.log("Raw data from Firestore:", data);
              
              const parsedData = typeof data.tripData === 'string' ? JSON.parse(data.tripData) : data.tripData;  
              settripData(parsedData);
              
              // Get location directly from user selection
              if (data.userSelection && data.userSelection.location) {
                  console.log("User selected location from create-trip:", data.userSelection.location);
                  const userLocation = data.userSelection.location;
                  
                  setLocation({
                      placeName: userLocation.address || userLocation.name || "Unknown",
                      address: userLocation.address,
                      name: userLocation.name,
                      ...userLocation
                  });
                  
                  localStorage.setItem('lastLocationQuery', userLocation.address || userLocation.name);
                  return;
              }
              
              let locationData = null;
              
              if (parsedData) {
                  console.log("Examining parsedData for location information...");
                  
                  if (parsedData.location) {
                      console.log("Found location in parsedData.location:", parsedData.location);
                      locationData = {
                          placeName: parsedData.location.placeName || parsedData.location.name || parsedData.location.address || parsedData.location
                      };
                  } else if (parsedData.tripName) {
                      // As a fallback, use tripName as the location
                      console.log("Using tripName as fallback:", parsedData.tripName);
                      locationData = { 
                          placeName: parsedData.tripName.split(" ")[0] 
                      };
                  }
                  
                  if ((!locationData || !locationData.placeName) && parsedData.dailyPlan && parsedData.dailyPlan.length > 0) {
                      const firstDay = parsedData.dailyPlan[0];
                      if (firstDay.places && firstDay.places.length > 0) {
                          const firstPlace = firstDay.places[0];
                          if (firstPlace.placeName) {
                              console.log("Using first place in dailyPlan as location:", firstPlace.placeName);
                              locationData = { placeName: firstPlace.placeName };
                          }
                      }
                  }
                  
                  if (locationData && locationData.placeName) {
                      console.log("Setting location for weather:", locationData);
                      setLocation(locationData);
                      localStorage.setItem('lastLocationQuery', locationData.placeName);
                  } else {
                      console.log("Could not find valid location data");
                      const defaultLocation = { 
                          placeName: "Dubai"
                      };
                      setLocation(defaultLocation);
                  }
              }
          } else {
              console.log("No such trip found!");
          }
      } catch (error) {
          console.error("Error fetching trip data:", error);
          setLocation({ placeName: "Dubai" });
      }
  };

  console.log("Trip Data:", tripData);
  console.log("Location for Weather Widget:", location);

  return (
    <>

    <div className='p-10 md:px-20 lg:px-44'>

    <InfoSection tripData={tripData}/>
    {location && <WeatherWidget location={location} />}
    <Hotels tripData={tripData}/>
    <DailyPlan tripData={tripData}/>
    
    </div>
    <Footer/>
    </>
   
  )
}

export default Viewtrip