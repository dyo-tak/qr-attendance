import {
  GeoPoint,
  Timestamp,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Generate = () => {
  const [eventId, setEventId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [precision, setPrecision] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const defaultLatitude = 19.045177278303775; // Default latitude
  const defaultLongitude = 72.88898169994356;

  useEffect(() => {
    if (map) {
      // Add click event listener to the map
      map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        setLatitude(lat);
        setLongitude(lng);

        // Remove existing marker if any
        if (marker) {
          marker.remove();
        }

        // Add a marker at the clicked location
        const newMarker = L.marker([lat, lng]).addTo(map);
        setMarker(newMarker);
      });
    }
  }, [map, marker]);

  const handleOpenMap = () => {
    setMapVisible(true);

    if (!map && mapVisible) {
      // Initialize the map
      const newMap = L.map("mapContainer").setView(
        [defaultLatitude, defaultLongitude],
        17
      ); // Adjust the zoom level as needed
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        newMap
      );

      setMap(newMap);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const dateTimeValue = new Date(
        `${dateValue}T${timeValue}` // Assumes dateValue and timeValue are in the format accepted by the Date constructor
      );
      const timestamp = Timestamp.fromDate(dateTimeValue);

      const eventDocRef = doc(db, "attendance", eventId);
      await setDoc(eventDocRef, {
        EventId: eventId,
        Location: new GeoPoint(parseFloat(latitude), parseFloat(longitude)),
        Precision: parseFloat(precision),
        Endtime: timestamp,
      });
      console.log("Document written with ID: ", eventId);
      setShowQRCode(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEventIdChange = (event) => {
    setEventId(event.target.value);
  };

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };

  const handlePrecisionChange = (event) => {
    setPrecision(event.target.value);
  };

  const handleDateInputChange = (event) => {
    setDateValue(event.target.value);
  };

  const handleTimeInputChange = (event) => {
    setTimeValue(event.target.value);
  };

  // Function to handle download button click
  const handleDownload = () => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    canvas.toBlob((blob) => {
      saveAs(blob, `${eventId}_qrcode.png`);
    });
  };

  // Reset form and QR code state
  const handleReset = () => {
    setEventId("");
    setShowQRCode(false);
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        {!showQRCode && (
          <form onSubmit={handleSubmit}>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3">
                <div className="mb-5">
                  <label
                    htmlFor="eventId"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Event Id
                  </label>
                  <input
                    type="text"
                    name="eventId"
                    id="eventId"
                    placeholder="Event Id"
                    value={eventId}
                    onChange={handleEventIdChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
            <div class="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="Location"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Location
                  </label>
                  <button
                    onClick={handleOpenMap}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    Open Map
                  </button>
                </div>
              </div>
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <label
                    for="guest"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    How precise
                  </label>
                  <input
                    type="number"
                    name="guest"
                    id="guest"
                    placeholder="50"
                    min="50"
                    value={precision}
                    onChange={handlePrecisionChange}
                    class="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
            {mapVisible && (
              <div
                id="mapContainer"
                style={{
                  height: "400px",
                  width: "100%",
                  maxWidth: "800px",
                  marginBottom: "10px",
                  borderRadius: "0.375rem",
                }} // Increase the max-width value
              ></div>
            )}

            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="latitude"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Latitude
                  </label>
                  <input
                    type="decimal"
                    name="latitude"
                    id="latitude"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={handleLatitudeChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="longitude"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Longitude
                  </label>
                  <input
                    type="decimal"
                    name="longitude"
                    id="longitude"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={handleLongitudeChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div class="-mx-3 flex flex-wrap">
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <label
                    for="date"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={dateValue}
                    onChange={handleDateInputChange}
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <label
                    for="time"
                    class="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={timeValue}
                    onChange={handleTimeInputChange}
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="hover:shadow-form  rounded-md bg-[#25242f] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Generate QR
              </button>
            </div>
          </form>
        )}

        {showQRCode && (
          <div className="mt-5" ref={qrCodeRef}>
            <QRCode value={eventId} size={500} includeMargin={true} />
            <div className="mt-2">
              <button
                onClick={handleDownload}
                className="hover:shadow-form rounded-md bg-[#25242f] py-3 px-8 text-center text-sm font-semibold text-white outline-none"
              >
                Download
              </button>
              <button
                onClick={handleReset}
                className="ml-2 hover:shadow-form rounded-md bg-[#25242f] py-3 px-8 text-center text-sm font-semibold text-white outline-none"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
