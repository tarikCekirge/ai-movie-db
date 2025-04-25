import React, { useEffect, useState } from 'react';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import MovieList from './components/MovieList';
import Movie from './components/Movie';
import EditMovieForm from './components/EditMovieForm';
import MovieHeader from './components/MovieHeader';
import FavoriteMovieList from './components/FavoriteMovieList';
import axios from 'axios';
import useLocalStorage from './hooks/useLocalStorage';
import { AddMovieForm } from './components/AddMovieForm';

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [darkMode, setDarkMode] = useLocalStorage('s11d3', true)
  const [favoriteMovies, setFavMovies] = useState([]);
  const history = useHistory()

  useEffect(() => {
    axios
      .get('https://nextgen-project.onrender.com/api/s11d3/movies')
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.error(`Axios GET (ID: ${id}) Hatası:`, err.message);
      });
  }, []);

  const deleteMovie = async (id) => {
    try {
      const response = await axios.delete(`https://nextgen-project.onrender.com/api/s11d3/movies/${id}`);
      setMovies(response.data);
      setFavMovies(favoriteMovies.filter(movie => movie.id.toString() !== id.toString()));
      history.push('/movies');
    } catch (err) {
      console.error(`Axios DELETE (ID: ${id}) Hatası:`, err.message);
      return false;
    }
  }

  const addToFavorites = (movie) => {
    const isAlreadyFavorite = favoriteMovies.find(fav => fav.id === movie.id);
    if (!isAlreadyFavorite) {
      setFavMovies([...favoriteMovies, movie]);
    } else {
      console.error('Film zaten favorilerde.');
    }
  };

  const toggleMode = () => {
    setDarkMode(!darkMode)

  }

  return (
    <div id="main-container" className={`${darkMode ? 'dark bg-slate-900 h-screen' : ''}`}>
      <nav className=" bg-zinc-800 text-white px-6 py-3 dark:bg-gray-800 ">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>{' '}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value={darkMode}
            onChange={toggleMode}
            className="sr-only peer"
            data-testid="darkMode-toggle"
            checked={darkMode}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3  font-medium text-gray-900 dark:text-gray-300">
            Dark Mode {darkMode ? 'On' : 'Off'}
          </span>
        </label>
      </nav>
      <div className=" max-w-4xl mx-auto px-3 pb-4 ">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList darkMode={darkMode} favoriteMovies={favoriteMovies} />
          <Switch>
            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie addToFavorites={addToFavorites} deleteMovie={deleteMovie} />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>
            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
