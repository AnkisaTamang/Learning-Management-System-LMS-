import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from 'react-youtube'; 
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating"; // Ensure this path is correct

const Player = () => {

   const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
   const { courseId } = useParams();
   const [courseData, setCourseData] = useState(null);
   const [openSections, setOpenSections] = useState({});
   const [playerData, setPlayerData] = useState(null);

   const getCourseData = () => {
      const course = enrolledCourses.find((course) => course._id === courseId); 
      if (course) setCourseData(course);
      else if (enrolledCourses.length > 0) {
          console.error(`Course with ID ${courseId} not found in enrolledCourses.`);
      }
   }

   const toggleSection = (index) => {
      setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
   };

   useEffect(() => {
      getCourseData();
   }, [enrolledCourses, courseId]); 

   const getYouTubeID = (url) => {
      if (!url) return '';
      const regex = /(?:\?v=|\/embed\/|\.be\/)([\w-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : '';
   }

   if (!courseData) {
      return <div className="p-10 text-center text-xl font-semibold">Loading course...</div>;
   }

   return (
      <>
         {/* Main Content Area */}
         <div className="p-4 sm:p-10 md:grid md:grid-cols-3 gap-10 md:px-36">
            {/* Left column: Course Structure and Rating */}
            <div className="text-gray-800 md:col-span-1 order-2 md:order-1">
               <h2 className="text-xl font-semibold">Course Structure</h2>
               <div className="pt-5">
                  {courseData.courseContent.map((chapter, index) => (
                     <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                        <div 
                           className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" 
                           onClick={() => toggleSection(index)}
                        >
                           <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                 <img 
                                    className={`transform transition-transform w-4 h-4 ${openSections[index] ? 'rotate-180' : ''}`} 
                                    src={assets.down_arrow_icon} 
                                    alt="arrow icon" 
                                 />
                                 <p className="font-medium md:text-base text-sm">{chapter.chapterTitle || ''}</p>
                              </div>
                              <p className="text-sm text-gray-500 ml-6">
                                 {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                              </p>
                           </div>
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                           <ul className="list-none md:pl-6 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                              {chapter.chapterContent?.map((lecture, i) => (
                                 <li key={i} className="flex items-center gap-2 py-2">
                                    <img src={assets.play_icon} alt="play icon" className="w-4 h-4" /> 
                                    <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-sm">
                                       <p className="flex-grow font-normal mr-2">{lecture.lectureTitle || ''}</p>
                                       <div className="flex gap-4 items-center flex-shrink-0">
                                          {lecture.lectureUrl && (
                                             <button
                                                onClick={() => {
                                                   setPlayerData({
                                                      ...lecture, 
                                                      chapter: index + 1, 
                                                      lecture: i + 1
                                                   });
                                                }}
                                                className="text-blue-500 cursor-pointer hover:underline text-xs md:text-sm"
                                             >
                                                Watch
                                             </button>
                                          )}
                                          <p className="text-gray-500 text-xs flex-shrink-0">
                                             {humanizeDuration((lecture.lectureDuration ?? 0) * 60 * 1000, { units: ['h', 'm'] })}
                                          </p>
                                       </div>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  ))}
               </div>

               {/* ⭐️ CORRECTED RATING SECTION ⭐️ */}
               {/* Use 'flex items-center gap-2' to put content side-by-side */}
               <div className="py-3 mt-10 flex items-center gap-2">
                  <h1 className="text-base font-semibold">Rate this Course:</h1>
                  <Rating initialRating={0} onRate={(newRating) => console.log('User rated:', newRating)} />
               </div>
            </div>

            {/* Right column: Video Player/Thumbnail */}
            <div className="md:col-span-2 order-1 md:order-2">
               {playerData ? (
                  <div className="sticky top-0">
                     <YouTube 
                        videoId={getYouTubeID(playerData.lectureUrl)} 
                        className='w-full aspect-video' 
                        opts={{
                            playerVars: { controls: 1 },
                        }}
                     />
                     <div className="flex justify-between items-center mt-3 p-2 bg-white rounded shadow">
                        <p className="font-semibold text-gray-800">
                           {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                        </p>
                        <button className="text-blue-600 font-medium hover:text-blue-700 transition duration-150">
                           {'Mark Complete'}
                        </button>
                     </div>
                  </div>
               ) : (
                  <img 
                     src={courseData.courseThumbnail} 
                     alt="Course Thumbnail"
                     className="w-full aspect-video object-cover rounded shadow" 
                  />
               )}
            </div>
         </div>
         
         {/* Footer Component */}
         <Footer/>
      </>
   );
};

export default Player;