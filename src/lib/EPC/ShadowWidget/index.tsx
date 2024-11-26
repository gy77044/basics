import SunLighting from "@arcgis/core/views/3d/environment/SunLighting.js";
import Slider from "@arcgis/core/widgets/Slider.js";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import globalLayers from "./../../../Utils/EPCMaps/Maps/GlobaLMap";
import Color from "@arcgis/core/Color";
import { getUTCOffsetForTimeZone } from "./getUTCoffsetTime";

// Helper function to format the current date as 'YYYY-MM-DD'
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Shadowwidget = () => {
  // console.log('object', '11')
  const [timeRange, setTimeRange] = useState([10, 16]); // Default time range
  const [timeZone, setTimeZone] = useState("IST"); // Default timezone
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Default date
  const [time, setTime] = useState(12);
  const [shadowColor, setShadowColor] = useState('#000000'); // default black

  const updateSunLighting = (value: number, timeZone?: string) => {
    const startHour = value; // Start time in slider
    const startDate = new Date(selectedDate);
    startDate.setHours(Math.floor(startHour));
    startDate.setMinutes((startHour % 1) * 60);
    console.log(selectedDate, 'date' , startDate)

    // Get the UTC timestamp of the startDate
    const utcTimestamp = startDate.getTime();

    // Format the date to the selected time zone using toLocaleString
    const adjustedDateString = new Date(utcTimestamp).toLocaleString("en-US", {
      timeZone: timeZone ? timeZone : globalLayers.timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    // Parse the formatted date back to a Date object
    const adjustedDate = new Date(adjustedDateString);

    // console.log(adjustedDate, 'globalLayers.timeZone', globalLayers.timeZone)
    globalLayers.view!.environment.lighting = new SunLighting({
      date: adjustedDate, // Set sunlight to start time
      directShadowsEnabled: true,
    });
  };

  // Handle date picker change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    updateTimeOfDay(event.target.valueAsDate);
  };

  // Handle timezone selection change
  const handleTimeZoneChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTimeZone(event.target.value);
    globalLayers.timeZone = event.target.value;

    // update lightning with the new timezone
    updateSunLighting(time, globalLayers.timeZone)
  };

  // Helper to convert a number (hours) into a readable time format
  const formatTime = (hour: number) => {
    const formattedHour = hour.toString().padStart(2, "0");
    return `${formattedHour}:00`;
  };

  // Handle "Longest Day" button click
  const handleLongestDayClick = () => {
    const longestDayDate = "Fri Jul 21 2024"; // Set the date for the longest day
    const startHour = 10; // 10 AM
    const endHour = 16; // 4 PM

    // Set the time range on the slider
    setTime(startHour);

    // Set the slider's values programmatically
    if (globalLayers.rangeSlider) {
      globalLayers.rangeSlider.values = [startHour];
    }

    // Update the SunLighting to show the time of day for the longest day (start and end time range)
    globalLayers.view!.environment.lighting = new SunLighting({
      date: new Date(`${longestDayDate} 15:00:00 GMT+0530 (IST)`), // Start of the range
      directShadowsEnabled: true,
    });
  };

  // Handle "Shortest Day" button click
  const handleShortestDayClick = () => {
    const longestDayDate = "Fri Dec 21 2024"; // Set the date for the longest day
    const startHour = 10; // 10 AM

    // Set the time range on the slider
    setTime(startHour);
    if (globalLayers.rangeSlider) {
      globalLayers.rangeSlider.values = [startHour];
    }

    // Update the SunLighting to show the time of day for the longest day (start and end time range)
    globalLayers.view!.environment.lighting = new SunLighting({
      date: new Date(`${longestDayDate} 15:00:00 GMT+0530 (IST)`), // Start of the range
      directShadowsEnabled: true,
    });
  };

  // Create the event's callback functions
  function updateTimeOfDay(ev: any) {
    globalLayers.view!.environment.lighting = new SunLighting({
      date: new Date(ev),
      directShadowsEnabled: true,
    });
  }

  // handle shadow color change
  const handleShadowColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setShadowColor(newColor);
    // Update ArcGIS shadow color here
    globalLayers.view!.highlightOptions = {
      shadowColor: new Color(newColor), // Update shadow color dynamically
      color: new Color(newColor),
      
      
    };

  };


  
  // Effect to load the ArcGIS Slider widget
  useEffect(() => {
    if (globalLayers.rangeSlider !== null) return;
    const slider_div = document.getElementById("timeSlider");
    if (!slider_div) return;

    globalLayers.rangeSlider = new Slider({
      container: slider_div,
      min: 0,
      max: 24,
      values: [time],
      visibleElements: {
        labels: true,
        rangeLabels: true,
      },
      precision: 0, // Whole numbers only (hours)
      tickConfigs: [
        {
          mode: "count",
          values: 5,
          labelsVisible: true,
          labelFormatFunction: (value: number) =>
            `${String(value).padStart(2, "0")}:00`,
        },
      ],
      snapOnClickEnabled: true,
    });
    globalLayers.rangeSlider.on("thumb-drag", (event) => {
      if (event.state === "stop") {
        const { value, index } = event;
        let newRange = [...timeRange];
        newRange[index] = value;
        setTime(value);
        updateSunLighting(value);
      }
    });
  }, [timeRange]);

  return (
    <div className="w-full shadow-widget px-[5px] py-1 border border-gray-300 rounded-md">
      <div className="mb-4">
        <span className="text-lg font-semibold">Time range</span>
      </div>

      {/* Time Range Display */}
      <div className="flex justify-around items-center mb-2">
        <span>{`${formatTime(time)}`}</span>
        <select
          value={timeZone}
          onChange={handleTimeZoneChange}
          className="border p-1 rounded-md"
        >
          <option value="PST">PST</option>
          <option value="EST">EST</option>
          <option value="GMT">GMT</option>
          <option value="IST">IST</option>
        </select>
      </div>

      {/* ArcGIS Slider */}
      <div className="relative mb-4">
        <div id="timeSlider" className="w-full"></div>
      </div>

      {/* Buttons for Longest and Shortest Days */}
      <div className="flex justify-around mt-4">
        <button
          onClick={handleShortestDayClick}
          className="bg-blue-500 hover:bg-primary-600 text-primary-100 px-[10px] py-[10px] rounded-md"
        >
          Shortest Day
        </button>
        <button
          onClick={handleLongestDayClick}
          className="bg-blue-500 hover:bg-primary-600 text-primary-100 px-[10px] py-[10px] rounded-md"
        >
          Longest Day
        </button>
      </div>

      {/* Date Picker */}
      <div className="flex justify-center items-center mt-2">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border-separate p-1 rounded-md"
        />
      </div>


      {/* Color Picker for Shadow */}
      <div className="flex justify-center items-center mt-2">
        <label htmlFor="shadowColor" className="mr-2">Shadow Color:</label>
        <input
          type="color"
          id="shadowColor"
          value={shadowColor}
          onChange={handleShadowColorChange}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default Shadowwidget;
