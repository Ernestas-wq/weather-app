import React, { useEffect, useState } from 'react';
import tilt from './tilt';
import Loading from './Loading';
import Pictures from './Pictures';

const WEATHER_API_KEY = '2988909ac8e7345682a2988e965f721b';

const checkIfCityExists = (cityName, cityArr) => {
  let inArr = false;
  cityArr.forEach(city => {
    if (city.name.toLowerCase() === cityName.toLowerCase()) inArr = true;
  });
  return inArr;
};

const City = () => {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fetchCity = async searchValue => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${WEATHER_API_KEY}&units=metric`;
    try {
      setLoading(true);
      const response = await fetch(url);
      if (response.status >= 200 && response.status <= 299) {
        const result = await response.json();
        const { main, sys, weather, name, id } = result;
        const city = {
          temp: Math.round(main.temp),
          country: sys.country,
          name: name,
          id: id,
          weather: weather[0]['description'],
        };
        setError({ show: false, msg: '' });
        setCities([...cities, city]);
        setLoading(false);
        setIsSubmitted(true);
        tilt();
      } else {
        setLoading(false);
        setError({ show: true, msg: 'Sorry city not found' });
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSubmitted(false);
    }, 100);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError({ show: false, msg: '' });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [error]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!checkIfCityExists(city, cities)) {
      cities.length < 2
        ? fetchCity(city)
        : setError({ show: true, msg: 'A maximum of 2 cities is allowed!' });
    } else {
      setError({ show: true, msg: 'City already exists!' });
    }
  };
  const removeCity = id => {
    const newCities = cities.filter(city => city.id !== id);
    setCities(newCities);
  };
  return (
    <>
      <a href="https://ernestas-portfolio.netlify.app/" className="portfolio">
        Portfolio
      </a>
      <h1>React Mini Weather</h1>
      <form className="search" onSubmit={handleSubmit} autoComplete="off">
        <div className="input-container">
          <input
            type="text"
            id="city"
            name="city"
            autoComplete="off"
            value={city}
            required
            onChange={e => setCity(e.target.value)}
          />
          <label htmlFor="username" className="label-name">
            <span className="content-name">Search for city</span>
          </label>
        </div>
        <button>Search</button>
      </form>
      <div className={`${error.show ? 'search-error search-error-active' : 'search-error'}`}>
        <p>{error.msg}</p>
      </div>
      {!loading && (
        <>
          <div className="cities">
            {cities.map((city, index) => {
              const { country, name, temp, weather, id } = city;
              return (
                <div className="cities__card" key={id}>
                  <div className="cities__content">
                    <h2>{index + 1}</h2>
                    <div></div>
                    <h3>
                      {name} <span>{country}</span>
                    </h3>
                    <p>
                      {temp}{' '}
                      <span>
                        &deg;<span>C</span>
                      </span>{' '}
                    </p>
                    <pre>{weather}</pre>
                    <button className="cities__remove" onClick={() => removeCity(id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <Pictures
        cities={cities}
        city={city}
        isSubmitted={isSubmitted}
        loading={loading}
        setCity={setCity}
      />
      {loading && <Loading />}
    </>
  );
};

export default City;
