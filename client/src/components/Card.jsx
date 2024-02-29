import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ data }) => {
  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };
  return (
    <div className="w-full h-full md:p-5 mt-3 md:mt-0 transition ease-in-out delay-75 hover:scale-105 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl">
      <Link to={data?.link} target="_blank" rel="noopener noreferrer">
        <div>
          <img
            className="w-full h-[30vh] object-cover"
            src={data?.image_url}
            alt={data?.title}
          />
          <div className="p-4">
            <h1 className="text-white text-lg font-semibold mb-2">
              {truncateTitle(data?.title, 50)}
            </h1>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;

