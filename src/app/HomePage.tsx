import { useState, useEffect } from "react";
import { CourseInfos } from "../constants/CourseInfo";
import { Video } from "lucide-react";
import { UpComingCourse } from "../constants/UpComingCourse";
import { OurTeams } from "../constants/OurTeams";

const courses = [
  {
    id: 1,
    title: "English–French",
    description:
      "Learn to speak and understand English through French. Focus on pronunciation, grammar, and daily communication to improve your fluency in both languages.",
    image: "/EnglishFrench.jpg",
  },
  {
    id: 2,
    title: "English–Swahili",
    description:
      "Master English using Swahili explanations. Perfect for beginners who want to strengthen vocabulary, grammar, and conversation skills.",
    image: "/EnglishSw.png",
  },
  {
    id: 3,
    title: "English–Lingala",
    description:
      "Develop your English through Lingala translation and practice. Build confidence in real-life speaking and comprehension.",
    image: "/Englishlingala.png",
  },
];

function HomePage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-5 px-4 md:px-10 lg:px-20">
      {/* Hero Section */}
      <div className="flex flex-col items-start text-center md:text-left p-6 w-full bg-gray-100 rounded-2xl shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Education is the <span className="text-green-600">Key</span>
        </h1>
        <p className="text-gray-600 font-medium leading-relaxed">
          Learn and study English in your native language, anytime and anywhere.
          Connect with your teacher for{" "}
          <span className="text-green-500 font-bold">1:1</span> sessions.
        </p>
        <div className="mt-8">
          <button className="border border-gray-800 px-6 py-3 rounded-2xl text-gray-800 font-bold hover:bg-green-800 hover:text-white transition-transform duration-300 hover:scale-105">
            Start Now
          </button>
        </div>
      </div>

      {/* Video Conference Section */}
      <div className="relative w-full h-[50vh] my-10 rounded-2xl overflow-hidden shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/home_LandingPage.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-between">
          <span className="font-semibold text-white m-4 p-2 text-lg">
            Video Conference
          </span>
          <div className="flex flex-col justify-center items-center">
            <Video
              className="text-gray-100 hover:text-green-600 transition-transform duration-300 hover:scale-110"
              size={60}
            />
          </div>
          <div className="bg-gray-200 w-full py-4 flex justify-center">
            <button className="px-6 py-3 font-bold border border-gray-800 rounded-2xl bg-white text-gray-800 hover:bg-green-800 hover:text-white transition-transform duration-300 hover:scale-105">
              Join Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Available Courses */}
      <section className="w-full my-10">
        <h2 className="font-bold text-2xl text-blue-500 mb-6">
          What You Need to Know
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-start gap-6">
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
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Talk with Teacher */}
      <section className="flex flex-col md:flex-row justify-between items-start w-full mt-10 bg-gray-50 rounded-2xl shadow-md overflow-hidden">
        <div className="flex flex-col w-full md:w-1/2 p-6">
          <h2 className="font-bold text-2xl text-blue-600 mb-5">
            Talk with Your Teacher
          </h2>
          {CourseInfos.map((courseInfo) => (
            <div key={courseInfo.id} className="mb-5">
              <h3 className="text-xl text-blue-600">{courseInfo.title}</h3>
              <p className="text-gray-700 mt-2">{courseInfo.description}</p>
              <span className="text-gray-800 font-semibold border-b border-gray-400">
                {courseInfo.teacher}
              </span>
            </div>
          ))}
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="px-6 py-3 border border-gray-800 text-gray-800 rounded-2xl font-bold text-lg hover:bg-gray-800 hover:text-white transition-transform duration-300 hover:scale-105">
              Chat Now
            </button>
            <button className="px-6 py-3 border border-green-700 text-green-700 rounded-2xl font-bold text-lg hover:bg-green-800 hover:text-white transition-transform duration-300 hover:scale-105">
              Schedule a Meeting
            </button>
          </div>
        </div>
        <div
          className="relative bg-cover bg-center w-full md:w-1/2 h-[60vh]"
          style={{ backgroundImage: "url('/TeacherClass.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-gray-100 font-bold text-lg">
              Help your children to learn
            </span>
          </div>
        </div>
      </section>

      {/* Upcoming Courses */}
      <section className="w-full mt-10">
        <h2 className="font-bold text-2xl text-gray-800 mb-6">Upcoming</h2>
        <div className="flex flex-wrap justify-center sm:justify-start gap-6">
          {UpComingCourse.map((UpComing) => (
            <div
              key={UpComing.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300 
                         w-full sm:w-[45%] md:w-[30%] lg:w-[22%]"
            >
              <img
                src={UpComing.image}
                alt={UpComing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  {UpComing.title}
                </h3>
                <p className="text-gray-600 text-sm">{UpComing.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Teams */}
      <section className="w-full mt-10 p-2">
        <h2 className="font-bold text-3xl text-gray-800 text-center mb-10">
          Our Teams
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {OurTeams.map((ours) => (
            <div
              key={ours.id}
              className="bg-white border border-gray-200 shadow-lg p-2 rounded-2xl w-full sm:w-[45%] md:w-[30%] lg:w-[22%] 
                         transform hover:scale-105 transition duration-300 cursor-pointer text-center"
            >
              <img
                src={ours.image}
                alt={ours.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {ours.name}
              </h3>
              <p className="text-gray-500 text-sm mb-3">{ours.role}</p>
              <p className="text-gray-600 text-sm">{ours.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Clock */}
      <div className="text-lg text-gray-700 mt-10 text-center">
        <p className="mb-2">
          <span className="font-semibold">Current Date:</span>{" "}
          {time.toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Current Time:</span>{" "}
          {time.getHours().toString().padStart(2, "0")}:
          {time.getMinutes().toString().padStart(2, "0")}:
          {time.getSeconds().toString().padStart(2, "0")}
        </p>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center gap-3 mt-8 mb-10">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <span className="text-blue-600 font-semibold text-xl">
          Working on it...
        </span>
      </div>
    </div>
  );
}

export default HomePage;
