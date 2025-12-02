// Improved responsive version of your HomePage component
// All your original logic kept, but layout refined for full responsiveness

import { CourseInfos } from "../constants/CourseInfo";
import { Video } from "lucide-react";
import { UpComingCourse } from "../constants/UpComingCourse";
import { OurTeams } from "../constants/OurTeams";

const courses = [
  {
    id: 1,
    title: "English–French",
    description:
      "Master English with clear explanations in French. Improve pronunciation, grammar, and everyday conversations.",
    image: "/EnglishFrench.jpg",
  },
  {
    id: 2,
    title: "English–Swahili",
    description:
      "Learn English using Swahili translations to strengthen vocabulary, grammar, and communication skills.",
    image: "/EnglishSw.png",
  },
  {
    id: 3,
    title: "English–Lingala",
    description:
      "Build confidence in English with Lingala guidance and practical speaking exercises for all levels.",
    image: "/Englishlingala.png",
  },
];

function HomePage() {
  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-[#0d0e10] text-gray-200 min-h-screen w-full overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="w-full p-6 sm:p-10 bg-[#16171a] rounded-2xl shadow-2xl border border-[#2e2f32] mt-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/10 via-purple-700/10 to-green-500/10 blur-3xl"></div>

        <div className="flex items-center gap-2 relative z-10 mb-4 flex-wrap">
          <img src="/logoJunior.png" className="w-8 h-8 text-blue-400" />
          <span className="px-4 py-2 bg-blue-600/20 text-blue-300 text-sm rounded-full font-semibold border border-blue-500/20 whitespace-nowrap">
            🚀 New Okapi Junior Academia Update
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-100 relative z-10 leading-snug mt-2">
          A Smarter Education Platform <span className="text-blue-500">Is Coming To You</span>
        </h1>

        <p className="text-gray-400 mt-5 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed relative z-10">
          We are upgrading our learning system to bring you faster tools, better lessons, modern technology, and a personalized learning experience.
        </p>

        <div className="mt-6 sm:mt-8 relative z-10 flex flex-wrap gap-4">
          <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-2xl border border-blue-500 text-blue-400 font-bold text-base sm:text-lg hover:bg-blue-600 hover:text-white transition-transform transform hover:scale-105">
            Discover the Update
          </button>
          <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-2xl border border-green-500 text-green-400 font-bold text-base sm:text-lg hover:bg-green-600 hover:text-white transition-transform transform hover:scale-105">
            Start Learning
          </button>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[55vh] my-10 rounded-2xl overflow-hidden shadow-2xl group">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-60 transition-all duration-500 group-hover:brightness-40"
          style={{ backgroundImage: "url('/home_LandingPage.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex flex-col justify-between p-4 sm:p-6 md:p-8">
          <span className="text-white font-semibold text-base sm:text-lg tracking-wide drop-shadow-md">
            Virtual Classroom
          </span>

          <div className="flex justify-center items-center">
            <Video
              size={70}
              className="text-blue-500 drop-shadow-lg transition-all duration-300 group-hover:text-green-400 group-hover:scale-125 cursor-pointer hover:animate-pulse"
            />
          </div>

          <div className="w-full flex justify-center mt-4">
            <button className="px-6 sm:px-10 py-2 sm:py-3 font-semibold border border-blue-500 rounded-2xl text-white bg-blue-600/20 hover:bg-blue-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Video size={20} className="text-white" />
              Join Live Session
            </button>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide drop-shadow-lg">
            Learn with Okapi Junior Academia
          </h2>

          <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
            Experience interactive virtual classrooms designed for flexible learning.
          </p>
        </div>
      </section>

      {/* COURSES */}
      <section className="w-full my-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-8 text-center">
          What You Can Learn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[#18181b] border border-[#2c2c30] rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 w-full"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-gray-100">{course.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTRUCTOR SECTION */}
      <section className="flex flex-col md:flex-row w-full mt-16 bg-[#18181b] rounded-2xl shadow-2xl border border-[#2b2b2f] overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-6 tracking-wide">
            Connect With Your Instructor
          </h2>

          {CourseInfos.map((info) => (
            <div key={info.id} className="mb-6">
              <h3 className="text-xl text-blue-300 font-semibold">{info.title}</h3>
              <p className="text-gray-400 mt-2 leading-relaxed">{info.description}</p>
              <span className="text-gray-300 font-semibold border-b border-gray-600 inline-block mt-2 pb-1">
                Instructor: {info.teacher}
              </span>
            </div>
          ))}

          <div className="flex flex-wrap gap-4 mt-8">
            <button className="px-6 py-3 rounded-2xl font-bold text-blue-400 border border-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105">
              Chat Now
            </button>
            <button className="px-6 py-3 rounded-2xl font-bold text-green-400 border border-green-500 hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105">
              Schedule Meeting
            </button>
          </div>
        </div>

        <div
          className="relative bg-cover bg-center w-full md:w-1/2 h-60 sm:h-72 md:h-[60vh]"
          style={{ backgroundImage: "url('/TeacherClass.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end px-6 pb-8">
            <span className="text-gray-100 font-bold text-sm sm:text-lg tracking-wide">
              Learn Smarter. Learn Faster. Learn With Confidence.
            </span>
          </div>
        </div>
      </section>

      {/* UPCOMING COURSES */}
      <section className="w-full mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-8 text-center">
          Upcoming Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {UpComingCourse.map((course) => (
            <div
              key={course.id}
              className="bg-[#18181b] border border-[#2c2c30] rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-blue-300">{course.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="w-full mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-10">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {OurTeams.map((member) => (
            <div
              key={member.id}
              className="bg-[#18181b] border border-[#2c2c30] shadow-lg p-5 rounded-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-gray-600"
              />
              <h3 className="text-lg font-semibold text-gray-100">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
              <p className="text-gray-400 text-sm mt-2">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePage;
