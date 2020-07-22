import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const initialMovie = {
  id: "",
  title: "",
  director: "",
  metascore: "",
  stars: [],
};

const UpdateMovieForm = (props) => {
  const { push } = useHistory();
  const { id } = useParams();
  const [movie, setMovie] = useState(initialMovie);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const changeHandler = (e) => {
    let value = e.target.value;
    if (e.target.name === "stars") {
      value = value.split(",");
    }
    setMovie({
      ...movie,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // PUT request to edit the item
    axios
      .put(`http://localhost:5000/api/movies/${id}`, movie)
      .then((res) => {
        console.log("UpdateMovieForm -> handleSubmit -> res.data", res.data);

        const updatedMovies = props.movieList.map((m) => {
          if (m.id === movie.id) {
            return res.data;
          } else {
            return m;
          }
        });
        console.log("UpdateMovieForm -> updatedMovies", updatedMovies);
        props.setMovieList(updatedMovies);
        push(`/`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='movie-card'>
      <h2>Update Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='title'
          onChange={changeHandler}
          placeholder='Title'
          value={movie.title}
        />
        <input
          type='text'
          name='director'
          onChange={changeHandler}
          placeholder='Director'
          value={movie.director}
        />
        <input
          type='string'
          name='stars'
          onChange={changeHandler}
          placeholder='Stars'
          value={movie.stars}
        />
        <button className='button form-button'>Save</button>
      </form>
      <pre>{JSON.stringify(movie, null, 2)}</pre>
    </div>
  );
};

export default UpdateMovieForm;
