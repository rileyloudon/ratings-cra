import React from 'react';
import { useLocation } from 'react-router-dom';

const Movie: React.FC = () => {
  const location = useLocation();
  console.log(location.state);

  // const movie = location.state;
  return <div>Movie</div>;
};

export default Movie;
