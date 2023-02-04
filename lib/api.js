import axios from "axios";

const API_KEY = '93f436edf975f6f1c72895b52928fe28';

const getWeather = async (location) => {
    const {latitude, longitude} = location;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=API_KEY`;
    const {data} = await axios.get(url);
    console.log(data, "hey");
    return data;
}

export default getWeather;