import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import axios from "axios";

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const HeroPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const profileData = await axios.get("/user/hero");
    setData(profileData.data);
  };

  return (
    <div className="w-full h-full">
      <div className="pt-20 pr-3 text-[3vmin] text-right capitalize">Hi, {user}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 ">
        {data.map((profile) => (
          <div
            key={profile._id}
            className="bg-white p-3 m-1 rounded-md shadow-md transition ease-in-out hover:scale-90"
          >
            <h1 className="text-xl font-bold mb-2 text-center capitalize p-2">
              {profile.firstName}
            </h1>
            <div className="text-center">
              <p className="p-1">
                Age: <span className="">{calculateAge(profile.birthdate)}</span>
              </p>
              <p className="p-1">
                Gender: <span className="">{profile.gender}</span>
              </p>
              <p className="p-1">
                Rating: <span className="">{profile.rating}</span>
              </p>
              <p className="p-1">
                Availability: <span className="capitalize">{profile.timeToPlay}; {profile.selectedDays}</span>
              </p>
              <div className="p-5">
                <button className="bg-green-500 hover:bg-green-800 text-white w-2/3 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green active:bg-green-700 ml-2">
                  <h1>Contact</h1>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroPage;
