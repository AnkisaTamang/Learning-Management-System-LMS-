import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import API from "../api/api";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || 'NRS';
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const response = await API.get('/courses');
      setAllCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to dummy data if backend fails
      setAllCourses(dummyCourses);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Helpers
  const calculateRating = (course) => {
    if (!course.courseRatings && !course.ratings) return 0;
    const ratings = course.courseRatings || course.ratings || [];
    if (!ratings.length) return 0;
    return ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration; // FIXED lec → lecture
      });
    });

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };
 const fetchUserEnrolledCourses = async () => {
   try {
     const response = await API.get('/student/enrollments');
     setEnrolledCourses(response.data);
   } catch (error) {
     console.error('Error fetching enrollments:', error);
     // Fallback to dummy data
     setEnrolledCourses(dummyCourses);
   }
 }
 
  const value = {
    currency,
    allCourses,
    navigate,
    enrolledCourses,
    setEnrolledCourses,
    isEducator,
    setIsEducator,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    fetchUserEnrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
