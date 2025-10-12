import { useState, useEffect } from "react"

function HomePage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex-col justify-center items-center  mt-5">
          
<div className="text-lg text-gray-700">
        <p className="mb-2">
          <span className="font-semibold">Current Date:</span> {time.toLocaleDateString()}
        </p>

        <p>
          <span className="font-semibold">Current Time:</span>{" "}
          {time.getHours().toString().padStart(2, "0")}:
          {time.getMinutes().toString().padStart(2, "0")}:
          {time.getSeconds().toString().padStart(2, "0")}
        </p>
      </div>

        <div className="flex items-center gap-2 justify-center mt-10">
        <div className="w-10 h-10 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <span className="text-blue-600 font-medium text-2xl ">Working on it...</span>
        </div>


    </div>
  )
}

export default HomePage