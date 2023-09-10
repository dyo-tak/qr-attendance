import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore"; // Import the 'query' function

// Rest of the code remains unchanged

// Function to fetch user data from the "users" collection for attendees
const getUsersFromAttendee = async (attendeeEmails) => {
  try {
    // Fetch all documents from the "users" collection where the email is in the "attendeeEmails" array
    const usersQuerySnapshot = await getDocs(
      query(collection(db, "users"), where("email", "in", attendeeEmails))
    );

    // Create an array to store the user data from the "users" collection
    const userData = usersQuerySnapshot.docs.map((doc) => doc.data());
    return userData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const Dashboard = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const attendanceCollectionRef = collection(db, "attendance");
      const attendanceQuerySnapshot = await getDocs(attendanceCollectionRef);

      const documents = await Promise.all(
        attendanceQuerySnapshot.docs.map(async (attendanceDoc) => {
          const attendeeCollectionRef = collection(
            attendanceDoc.ref,
            "Atendee"
          );
          const attendeeQuerySnapshot = await getDocs(attendeeCollectionRef);
          const attendeeDocs = attendeeQuerySnapshot.docs.map((attendeeDoc) =>
            attendeeDoc.data()
          );

          return {
            attendanceData: attendanceDoc.data(),
            attendeeDocs,
          };
        })
      );

      setDocs(documents);
    };

    fetchData();
  }, []);

  const handleDownloadSheet = async (attendeeDocs) => {
    // Fetch the user data for attendees from the "users" collection
    const attendeeEmails = attendeeDocs.map((attendee) => attendee.email);
    const userData = await getUsersFromAttendee(attendeeEmails);

    // Create CSV content
    let csvContent = "email,classname,phonenumber,firstname,lastname\n";

    // Combine attendee data with user data and add to CSV content
    attendeeDocs.forEach((attendee, index) => {
      const user = userData[index];
      const row = [
        attendee.email,
        user ? user.classname : "",
        user ? user.phonenumber : "",
        user ? user.firstname : "",
        user ? user.lastname : "",
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadURL = URL.createObjectURL(blob);

    // Create a temporary link element and simulate a click to initiate the download
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "attendee_sheet.csv";
    link.click();
  };

  return (
    <div>
      <ol style={{ padding: "10px" }}>
        {docs.map((doc, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <a
              href="#"
              onClick={() => handleDownloadSheet(doc.attendeeDocs)}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {doc.attendanceData && doc.attendanceData.EventId}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Dashboard;
