import React from 'react'
import { useEffect, useState } from 'react'
import axios from "axios";
import { FaSearchLocation } from "react-icons/fa";
import { IoPartlySunnyOutline } from "react-icons/io5";
import moment from 'moment-timezone';

const Index = () => {
  const [location, setLocation] = useState({});

  const [data, setData] = useState();

  const [currentTime, setCurrentTime] = useState("");

  const [theme, setTheme] = useState('');

  const [cityPre, setCityPre] = useState(null);
  const [city, setCity] = useState(null);
  useEffect(() => {
    // function to get user current location & show the current time
    const getUserTime = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const date = new Date();
          const hour = date.getHours();
          const minute = date.getMinutes();
          setCurrentTime(`${hour}:${minute}`);
          if((hour>='18') && (minute>='00' || minute>='0' )) {
            setTheme('data-theme')
          }
        },
        (error) => {
          // console.error(error);
        }
      );
    };

    getUserTime();
  }, [city]);



  const getCityName = (c) => {
    console.log(c, "c")
    setCityPre(c);
  }

  function getDataAsPerCITY() {
    setCity(cityPre);
  }


  // function to check current address 
  function checkMyWeather() {
    setCity(setLocation.city);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        )
          .then(res => res.json())
          .then(data => {
            setLocation({
              city: city ? city : (data.address.town || data.address.city || data.address.state),
              country: data.address.country
            });
          });
      });
    }

  }


  // getting my current location ( city & country )
  useEffect(() => {
    checkMyWeather();
  }, [city]);

  // api for getting weather data
  const options = {
    method: 'GET',
    url: 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather',
    params: { city: `${location.city && location.city}` },
    headers: {
      'X-RapidAPI-Key': 'e07e13eeebmsh9d9702b3c449eefp19f07ajsn5dea798f39e1',
      'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response) {
    // console.log(response.data);
    setData(null);
    setData(response && response.data)
  }).catch(function (error) {
    // console.error(error);
  });


  function changeTheme () {
   if(theme == "data-theme"){
    setTheme(null);
   }
   else{
     setTheme('data-theme');
   }
  }

  
  // const checkbox = document.getElementById('checkbox');

  // checkbox.addEventListener('change', () => {
  //   document.body.classList.toggle('dark');
  // })

  return (
    <>
      <main className={`'container'+ ${theme}`}>

        {/* weather app body start */}
        <div className="row  d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
          <div className="col-lg-4 col-md-9 col-sm-11 col-11">

            <section className='weather-body'>

              {/* inputs for searching location */}
              <div className="search-country d-flex align-items-center justify-content-between">
                <input onChange={(x => getCityName(x.target.value))} type="text" placeholder='Another location ?' />
                <div onClick={getDataAsPerCITY} className="submit-icon">
                  <FaSearchLocation />
                </div>
              </div>

              {/* displaying the weather data */}
              <div className="weather">

                <div className="country-time d-flex align-items-center justify-content-between">

                  {/* weather country name */}
                  <div className="country-name"><h6>{city ? city : (location ? location.city : 'loading...')}</h6></div>

                  {/* current time */}
                  <div className="current-time"><h6>{currentTime}</h6></div>

                </div>

                <div className="weather-behavour d-flex flex-column align-items-center justify-content-center">
                  <div className="weather-icon">
                    <IoPartlySunnyOutline />
                  </div>
                  <div className="weather-status"><p>Sunny</p></div>
                </div>

                <div className="row additional">
                  <div className="col-8">
                    <div className="data-1">{data ? data && data.wind_speed : 'loading...'} km/h</div>
                    <div className="data-2">{data ? data.wind_degrees : 'loading...'} %</div>
                    <div className="data-3">{data ? data.humidity : 'loading...'} h</div>
                  </div>
                  <div className="col-4">
                    <div className="tempreture d-flex flex-column align-items-center justify-content-center">
                      <h1>{data ? data.temp : '...'}<sup>o</sup></h1>
                      <div className='pt-3'>
                        <input onClick={changeTheme} type="checkbox" class="checkbox" id="checkbox" />
                        <label for="checkbox" class="label">
                          <i class="fas fa-moon"></i>
                          <i class='fas fa-sun'></i>
                          <div class='ball'></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>


                <a onClick={checkMyWeather} href="#">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  My Weather ?
                </a>


              </div>


            </section>

          </div>
        </div>
        {/* weather app body end */}

      </main>
    </>
  )
}

export default Index