import React, { useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, BUDGET_OPTIONS, SELECTTRAVEL_LIST } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";

function CreateTrip() {
    const [place, setPlace] = useState(null);
    const [formData, setFormData] = useState({
        location: null,
        NumberofDays: "",
        budget: "",
        traveler: "",
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Update formData state properly
    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onGenerateTrip = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (!formData?.traveler || !formData?.budget || !formData.location || formData?.NumberofDays > 10) {
            toast("Please fill all the details!");
            return;
        }

        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replaceAll('{location}', formData?.location?.address)
            .replaceAll('{traveler}', formData?.traveler)
            .replaceAll('{NumberofDays}', formData?.NumberofDays)
            .replaceAll('{budget}', formData?.budget);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        SaveTrip(result?.response.text());
        setLoading(false);
    };

    const GetUserProfile = async (codeResponse) => {
        try {
            const { access_token } = codeResponse;
            const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const userProfile = response.data;
    
            // Save user profile to localStorage
            localStorage.setItem('user', JSON.stringify(userProfile));
            toast.success("Login successful!");
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to fetch user profile. Please try again.");
        }
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => GetUserProfile(codeResponse),
        onError: (error) => console.log(error),
        flow: 'implicit'
    });

    const SaveTrip = async (TripData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();
        await setDoc(doc(db, "AItrips", docId), {
            userSelection: formData,
            tripData: TripData,
            userEmail: user?.email,
            id: docId
        });
        navigate('/view-trip/' + docId);
    };

    return (
        <div className="sm:px-10 md:px-30 lg:px-56 xl:px-72 px-5 mt-28 text-gray-900">
            <h1 className="font-bold text-4xl">Tell us your travel preferences 🌴⛰️</h1>
            <p className="text-gray-600 mt-2">Just provide some basic information, and our trip planner will generate a customized itinerary.</p>

            <div className="flex flex-col gap-9 mt-8">
                {/* Destination Selection */}
                <div>
                    <h2 className="text-xl my-3 font-bold">Enter choice of destination:</h2>
                    <ReactGoogleAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        className="pr-50 pl-5 py-2 shadow-md rounded-md w-full transition-all 
                        hover:border-orange-400 focus:ring-2 focus:ring-orange-300 focus:shadow-lg"
                        onPlaceSelected={(place) => {
                            if (!place?.formatted_address || !place.geometry) return;
                            const selectedPlace = {
                                address: place.formatted_address,
                                name: place.name || "Unknown",
                                placeId: place.place_id,
                                location: {
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng()
                                }
                            };
                            setPlace(selectedPlace);
                            handleInputChange('location', selectedPlace);
                        }}
                    />
                </div>

                {/* Number of Days */}
                <div>
                    <h2 className="text-xl my-3 font-bold">Duration of the trip (in days):</h2>
                    <Input
                        onChange={(e) => handleInputChange('NumberofDays', e.target.value)}
                        placeholder="Example: 3"
                        className="pl-5 py-2 shadow-md border border-gray-300 rounded-md w-full transition-all 
                        hover:border-orange-400 focus:ring-2 focus:ring-orange-300 focus:shadow-lg"
                        type="number"
                    />
                </div>
            </div>

            {/* Budget Selection */}
            <div className="mt-10">
                <h2 className="font-bold text-xl">What is your Budget?</h2>
                <div className="grid grid-cols-3 gap-4 mt-5">
                    {BUDGET_OPTIONS.map((item, index) => (
                        <div key={index}
                            className={`p-5 border rounded-lg transition-all duration-300 cursor-pointer
                bg-white shadow-md hover:shadow-2xl hover:border-orange-500 
                hover:scale-105 hover:bg-gradient-to-r from-orange-100 to-white
                ${formData.budget === item.title ?
                                    "border-orange-500 bg-orange-200 scale-110 shadow-xl ring-2 ring-orange-400" : ""}`}
                            onClick={() => handleInputChange('budget', item.title)}
                        >
                            <div className="text-3xl">{item.icon}</div>
                            <div className="text-xl font-bold">{item.title}</div>
                            <div className="text-gray-500">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="font-bold text-xl">Choose Your Travel Style</h2>
                <div className="grid grid-cols-3 gap-4 mt-5">
                    {SELECTTRAVEL_LIST.map((item, index) => (
                        <div key={index}
                            className={`p-5 border rounded-lg transition-all duration-300 cursor-pointer
                bg-white shadow-md hover:shadow-2xl hover:border-blue-500 
                hover:scale-105 hover:bg-gradient-to-r from-blue-100 to-white
                ${formData.traveler === item.title ?
                                    "border-blue-500 bg-blue-200 scale-110 shadow-xl ring-2 ring-blue-400" : ""}`}
                            onClick={() => handleInputChange('traveler', item.title)}
                        >
                            <div className="text-3xl">{item.icon}</div>
                            <div className="text-xl font-bold">{item.title}</div>
                            <div className="text-gray-500">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Generate Trip Button */}
            <div className="my-10 flex justify-end">
                <Button className="text-lg px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 
                text-white font-semibold rounded-full shadow-lg transition-all 
                hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-orange-300 cursor-pointer"
                    onClick={onGenerateTrip} disabled={loading}>
                    {loading ? <AiOutlineLoading3Quarters className="size-7 animate-spin block" /> : 'Generate Trip'}
                </Button>
            </div>

            {/* Login Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Login Required</DialogTitle>
                    </DialogHeader>
                    <Button className="mt-4 flex items-center justify-center w-full py-2 border bg-white text-black 
                    hover:border-gray-500 transition-all duration-200"
                        onClick={login}>
                        <FcGoogle className="mr-2 size-6" /> Continue with Google
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTrip;