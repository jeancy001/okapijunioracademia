import { useState, useEffect } from "react"
const courses = [
  {
    id: 1,
    title: "English–French",
    description:
      "Learn to speak and understand English through Tshiluba. This course focuses on vocabulary, pronunciation, and everyday conversation to build your confidence in both languages.",
    image: "/English  French.jpg",
  },
  {
    id: 2,
    title: "English–Swahili",
    description:
      "Master English using Swahili explanations and examples. Ideal for beginners, this course helps you improve grammar, reading, and listening skills for daily communication.",
    image: "/EnglishSw.png",
  },
  {
    id: 3,
    title: "English–Lingala",
    description:
      "Enhance your English language skills with guidance in Lingala. Learn useful phrases, sentence structures, and practical expressions for travel, study, and work.",
    image: "/Englishlingala.png",
  },
];

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
        
        {/* Home page and all  the informatins  */}
        <div className="flex flex-col  md:flex-col m-10 p-5 bg-gray-100 rounded-2xl ">
      
          <span className="text-red-600 font-bold text-2xl mb-5  border-gray-300 border-b ">Education is the <span className="text-green-600">Key</span></span>
           

           <span className="text-balance font-bold  text-gray-600 justify-center  ">
            Learn and study English in your native language,
            anytime and anywhere. 
            Connect with your teacher for 
            <span className="text-green-500"> 1:1  </span> sessions.
           </span>
           <div className="flex-col justify-start mt-10 ">
              <button className="border border-1 border-gray-800 p-4 rounded-2xl text-gray-800 font-bold  hover:bg-green-800 hover:text-gray-100 hover:font-bold  transition-transform duration-300 hover:scale-105 ">Start Now </button> 
           </div>
           
     
        </div>


         {/* Zoom  videos  informations  */}
        <div className="p-5 m-5 ">
         <div className="relative bg-cover bg-center w-full h-[50vh] opacity-2"style={{ backgroundImage: "url('/home_LandingPage.jpg')" }}>
          <div className="absolute inset-0 bg-black/50 flex flex-col  justify-between">

           <span className="font-semibold text-white m-4 p-2 ">Video  Conference </span>


         <div className="bg-gray-300 mb-0 b-0 w-full  py-3 p-2">
             <span>Start Now  </span>
              
        </div>
          </div>

        </div> 
        </div>


        {/* Selection  fors  all  avaibles courses  */}
        <div className="p-5">
          <div className=" flex flex-col p-5">
            <span className="font-bold text-2xl text-blue-500 ">What you need to Know </span>
             
             
                </div>
      <div className="flex flex-wrap justify-center">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden m-5 w-80 hover:scale-105 transform transition duration-300"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-700 text-sm">{course.description}</p>
            </div>
          </div>
        ))}
      </div>


        </div>

       {/* Updating  the application    */}
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