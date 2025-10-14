import { useState, useEffect } from "react"
import { CourseInfos } from "../constants/CourseInfo";
import { Video } from "lucide-react";
import { UpComingCourse } from "../constants/UpComingCourse";
import { OurTeams } from "../constants/OurTeams";
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
        <div className="flex flex-col p-5 w-full md:flex-col   bg-gray-100 rounded-2xl ">
      
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
        <div className="flex flex-col  w-full ">
         <div className=" relative bg-cover bg-center w-full h-[50vh] opacity-2"style={{ backgroundImage: "url('/home_LandingPage.jpg')" }}>
          <div className="absolute inset-0 bg-black/50 flex flex-col  justify-between">

           <span className="font-semibold text-white m-4 p-2 ">Video  Conference </span>
               <div className=" flex flex-col justify-center items-center ">
                <Video className="text-center text-gray-100 hover:text-green-800 transition-transform duration-300 hover:scale-105" size={60}/>
               </div>
         <div className="bg-gray-300 mb-0 b-0 w-full  py-3 p-2">
             <button className="p-4 m-2 font-bold border border-1 border-gray-800 rounded-2xl items-center bg-gray-100 text-gray-800 hover:bg-green-800 hover:text-gray-100 transition-transform duration-300 hover:scale-105 ">Join meeting </button>
              
        </div>
          </div>

        </div>
        </div>


        {/* Selection  fors  all  avaibles courses  */}
     <div className="flex flex-col w-full ">
          <div className=" flex flex-col  ">
            <span className="font-bold text-2xl text-blue-500 p-5">What you need to Know </span>
             
             
          </div>
     <div className="flex flex-wrap justify-start gap-6 p-4">
  {courses.map((course) => (
    <div
      key={course.id}
      className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300 
                 w-full sm:w-[45%] md:w-[30%] lg:w-[22%]"
    >
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          {course.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {course.description}
        </p>
      </div>
    </div>
  ))}
</div>



  </div>
        {/* All Courses */}
      <div className="mt-5">
           <div className="flex flex-col justify-between sm:flex-row  md:flex-row items-center ">
              <div className="flex flex-col mt-2 w-full ">
               <span className="mb-5 p-2 font-bold text-2xl text-blue-600 p-5 ">Talk  with your  Teacher</span>

               <div>
                {CourseInfos.map((courseInfo)=>(
                  <div className="m-4" key={courseInfo.id}>
                     <span className="text-2xl text-blue-600">{courseInfo.title}</span>
                     <p className="text-wrap block mt-2">
                      {courseInfo.description}
                     </p>
                     <span className="text-gray-800 font-semibold mt-5 border-b border-gray-400">{courseInfo.teacher}</span>
                  </div>
                ))}
               </div>
                <div className="flex flex-col sm:flex-row md:flex-row items-center m-5">
                  <button className="m-5 p-5 border border-1 border-gray-800 text-gray-800 rounded-2xl font-bold text-2xl  hover:bg-gray-800 transition-transform duration-300 hover:scale-105 hover:text-gray-100">Chat Now</button>
                  <button className="m-5 p-5 border border-1 border-green-700 text-green-700 rounded-2xl font-bold text-2xl hover:bg-green-800 hover:text-gray-200 transition-transform duration-300 hover:scale-105">Schedule a meeting</button>
                </div>
              </div>
              <div className=" relative bg-cover  bg-center w-full h-[130vh] " style={{backgroundImage:"url('/TeacherClass.jpg')"}}>
                 <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center ">
                  <span className="text-gray-200 font-bold ">Help your children to learn</span>
                    
                 </div>
              </div>
           </div>
      </div>


      {/* Updat Comming  Courses */}
      <div>
         <span className="font-bold text-2xl text-gray-800 m-5">Up Coming</span>
         <div className="flex flex-wrap  sm:flex-row md:flex-row  justify-start gap-6 p-2 ">
           {UpComingCourse.map((UpComing)=>(
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300 
                 w-full sm:w-[45%] md:w-[30%] lg:w-[22%]" key={UpComing.id}> 
              <img src={UpComing.image} alt={UpComing.title}  className="w-full h-48 object-cover" />
              <span className="text-2xl font-bold text-blue-700 m-3  mb-5 ">{UpComing.title}</span>
              <p className="text-wrap block m-3 ">{UpComing.description}</p>
            </div>
           ))}
         </div>
      </div>


{/* Our Teams */}
<div className="p-5">
  <h2 className="font-bold text-3xl text-gray-800 text-center mb-10">
    Our Teams
  </h2>

  <div className="flex flex-wrap justify-center gap-8">
    {OurTeams.map((ours) => (
      <div
        key={ours.id}
        className="bg-white border border-gray-200 shadow-lg p-6 rounded-2xl w-full sm:w-[45%] md:w-[30%] lg:w-[22%] 
                   transform hover:scale-105 transition duration-300 cursor-pointer"
      >
        <img
          src={ours.image}
          alt={ours.name}
          className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
        />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">{ours.name}</h3>
          <p className="text-gray-500 text-sm mb-3">{ours.role}</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {ours.description}
          </p>
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