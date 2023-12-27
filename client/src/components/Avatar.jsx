import React from "react";

const Avatar = ({ userId, username, online }) => {
  const colors = [
    "bg-red-500", "bg-green-500", "bg-purple-500", "bg-blue-500", "bg-yellow-500",
    "bg-teal-500", "bg-pink-500", "bg-indigo-500", "bg-gray-500", "bg-orange-500",
    "bg-red-300", "bg-green-300", "bg-purple-300", "bg-blue-300", "bg-yellow-300",
    "bg-teal-300", "bg-pink-300", "bg-indigo-300", "bg-gray-300", "bg-orange-300",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const profileColor = colors[colorIndex];

  // Check if username is defined and not an empty string
  const avatarContent =
    username && username.length > 0 ? username[0][0] : "";

  return (
    <div className="relative w-8 h-8">
      {/* Green dot to represent online status */}
      {online !== undefined && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
            online ? "bg-green-500" : "bg-red-500"
          } border-white`}
        />
      )}

      {/* Avatar content */}
      <div
        className={`w-full h-full rounded-full justify-center flex items-center ${profileColor}`}
      >
        <h1 className={`opacity-60 capitalize ${profileColor}`}>
          {avatarContent}
        </h1>
      </div>
    </div>
  );
};

export default Avatar;
