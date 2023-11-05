import React, { useState } from "react";
import axios from "axios";
import Header from './Header';

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/get_weather", { city });
      const data = response.data;

      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="container">
        <Header/>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Chat</div>
            <div className="card-body chat-container">
              {weather && (
                <div className="message">
                  <div className="message-content text-right">
                    <p><strong>ChatBot:</strong></p>
                    <p>Thành phố: {weather.city}</p>
                    <p>Thời tiết: {weather.weather}</p>
                    <p>Độ ẩm: {weather.humidity}%</p>
                    <p>Áp suất: {weather.pressure} hPa</p>
                  </div>
                </div>
              )}

              <div className="message">
                <div className="message-content">
                  <p><strong>Bạn:</strong></p>
                  <input
                    type="text"
                    placeholder="Nhập tên thành phố"
                    value={city}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <button onClick={handleSubmit} className="btn btn-primary mt-2">
                    Lấy thông tin thời tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
