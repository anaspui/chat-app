import Head from "next/head";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { FaUserAlt } from "react-icons/fa";

const Home = () => {
  const [username, setUsername] = useState(generateRandomUsername());
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Pusher.logToConsole = false;

    const pusher = new Pusher("61181dbaa3d4a796d582", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = [username, message];
    //Need to fix this JSON error
    //Temp fix- passing an Array instead
    try {
      const response = await fetch("http://localhost:8000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit message");
      }

      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error.message);
    }
  };

  return (
    <div className="container">
      <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a
          href="/"
          class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <svg class="bi me-2" width="40" height="32"></svg>
          <span class="fs-4">Simple Live Chat</span>
        </a>
      </header>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
          crossOrigin="anonymous"
        />
      </Head>

      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
          <FaUserAlt className="mx-2" />
          <input
            className="fs-8 fw-semibold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div
          className="list-group list-group-flush border-bottom scrollarea"
          style={{ minHeight: "500px" }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className="list-group-item list-group-item-action py-3 lh-tight"
            >
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">{message.username[0]}</strong>
              </div>
              <small className="col-10 mb-1 small">{message.message[1]}</small>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="d-flex">
        <input
          className="form-control"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />{" "}
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};
function generateRandomUsername() {
  const firstName = [
    "Michael",
    "Christopher",
    "David",
    "James",
    "John",
    "Robert",
    "Daniel",
    "Matthew",
    "William",
    "Joseph",
    "Brian",
    "Anthony",
    "Richard",
    "Charles",
  ];
  const randomFirstName =
    firstName[Math.floor(Math.random() * firstName.length)];
  return randomFirstName;
}

export default Home;
