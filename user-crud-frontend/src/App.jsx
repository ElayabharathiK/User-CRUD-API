import { useState } from 'react'

function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setDeleteMessage("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    

    try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message);
      setIsError(true);
      return;
    }

    setIsError(false);
    setMessage(data.message);
    setName("");
    setEmail("");
    setPassword("");
  } catch (error) {
    setIsError(true);
    setMessage("Unable to connect to server. Please try again.");
  }
  };
  

  const handleDelete = async () => {
    setMessage("");
    setDeleteMessage("");

    if (!userId.trim()) {
      setIsError(true);
      setDeleteMessage("Please enter a user ID.");
      return;
    }
    try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      setIsError(true);
      setDeleteMessage(data.message);
      return;
    }

    setIsError(false);
    setDeleteMessage(data.message);
    setUserId("");
  } catch (error) {
      setIsError(true);
      setDeleteMessage("Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">User Management</h1>
        {message && (
          <p className={`${isError ? "text-red-600" : "text-green-600"} text-center mb-4`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="User name" 
            className="w-full border p-2 mb-4 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="User email" 
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="User password" 
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Create User</button>
          <h2 className="text-xl font-bold text-center mt-8 mb-4">
            Delete User
          </h2>
          {deleteMessage && (
            <p className={`${isError ? "text-red-600" : "text-green-600"} text-center mb-4`}>
              {deleteMessage}
            </p>
          )}
          <input
            type="text"
            placeholder="Enter user ID"
            className="w-full border p-2 mb-4 rounded"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Delete User
          </button>
        </form> 
      </div>
    </div>
  );
}

export default App;