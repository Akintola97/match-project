// import React from "react";

// const Avatar = ({ userId, username }) => {
//   const colors = [
//     "bg-red-200",
//     "bg-green-200",
//     "bg-purple-200",
//     "bg-blue-200",
//     "bg-yellow-200",
//     "bg-teal-200",
//   ];
//   const userIdBase10 = parseInt(userId, 16);
//   const colorIndex = userIdBase10 % colors.length;
//   const profileColor = colors[colorIndex];

//   return (
//     <div className={"w-8 h-8 bg-red-200 rounded-full justify-center flex items-center " + profileColor}>
//      <h1 className="opacity-60 capitalize">{username[0]}</h1>
//     </div>
//   );
// };

// export default Avatar;

import React from "react";

const Avatar = ({ userId, username }) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const profileColor = colors[colorIndex];

  const avatarContent = username.length > 0 ? username[0][0] : ""; //get the first array and then the first letter of the array

  return (
    <div
      className={
        "w-8 h-8 rounded-full justify-center flex items-center " + profileColor
      }
    >
      <h1 className={`opacity-60 capitalize ${profileColor}`}>
        {avatarContent}
      </h1>
    </div>
  );
};

export default Avatar;
