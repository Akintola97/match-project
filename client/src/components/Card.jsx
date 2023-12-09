import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ data }) => {
  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };
  return (
    <div className="w-full h-full md:p-5 border mt-3 md:border-none transition ease-in-out delay-75 hover:scale-90">
      <Link to={data?.link} target="_blank" rel="noopener noreferrer">
        <div className="overflow-hidden rounded-lg shadow-lg">
          <img
            className="w-full h-[30vh] object-cover"
            src={data?.image_url}
            alt={data?.title}
          />
          <div className="p-4">
            <h1 className="text-black text-lg font-semibold mb-2">
            {truncateTitle(data?.title, 50)}
              </h1>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
