const db = require('./config/database');

const courseUpdates = [
  // Programming Courses
  { title: 'Advanced React & Redux', image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', video_url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
  { title: 'Full Stack JavaScript', image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', video_url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk' },
  { title: 'Python Machine Learning', image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', video_url: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
  { title: 'HTML Basics', image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400', video_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE' },
  { title: 'WordPress Development', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400', video_url: 'https://www.youtube.com/watch?v=6ONPFb-v6eg' },
  
  // Design Courses
  { title: 'UI/UX Design Mastery', image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', video_url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU' },
  { title: 'Adobe Creative Suite', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', video_url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs' },
  { title: 'Brand Identity Design', image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400', video_url: 'https://www.youtube.com/watch?v=YNDviNJbePs' },
  { title: 'Color Theory', image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', video_url: 'https://www.youtube.com/watch?v=_2LLXnUdUIc' },
  { title: 'Mobile App Design', image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', video_url: 'https://www.youtube.com/watch?v=68w2VwalD5w' },
  
  // Business Courses
  { title: 'Startup Strategy', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', video_url: 'https://www.youtube.com/watch?v=ZoqgAy3h4OM' },
  { title: 'Digital Marketing ROI', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', video_url: 'https://www.youtube.com/watch?v=nU-IIXBWlS4' },
  { title: 'Investment Banking', image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', video_url: 'https://www.youtube.com/watch?v=WEDIj9JBTC8' },
  { title: 'Project Management', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', video_url: 'https://www.youtube.com/watch?v=3qQic7TfCeI' },
  { title: 'Excel Mastery', image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400', video_url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg' },
  
  // Health Courses
  { title: 'Complete Nutrition Guide', image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', video_url: 'https://www.youtube.com/watch?v=xyQY8a-ng6g' },
  { title: 'Yoga Teacher Training', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', video_url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
  { title: 'Mental Health First Aid', image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', video_url: 'https://www.youtube.com/watch?v=DxIDKZHW3-E' },
  
  // Creative Courses
  { title: 'Music Production Pro', image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', video_url: 'https://www.youtube.com/watch?v=TEjOdqZFvhY' },
  { title: 'Creative Writing Workshop', image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', video_url: 'https://www.youtube.com/watch?v=blehVIDyuXk' },
  { title: 'Photography Masterclass', image_url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400', video_url: 'https://www.youtube.com/watch?v=V7z7BAZdt2M' },
  { title: 'Guitar Lessons', image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', video_url: 'https://www.youtube.com/watch?v=F5bqTg4rGHM' },
  
  // Communication
  { title: 'Public Speaking', image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400', video_url: 'https://www.youtube.com/watch?v=HAnw168huqA' },
  
  // Language
  { title: 'English Grammar', image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', video_url: 'https://www.youtube.com/watch?v=sOmLdT7g_QY' },
  { title: 'Spanish Conversation', image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', video_url: 'https://www.youtube.com/watch?v=DAp_v7EH9AA' }
];

async function updateCourseProfiles() {
  try {
    console.log('Updating course profiles with images and educational videos...');
    
    for (const update of courseUpdates) {
      const [result] = await db.execute(
        'UPDATE courses SET image_url = ? WHERE title = ?',
        [update.image_url, update.title]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✅ Updated: ${update.title}`);
        
        // Update lessons with educational video URLs
        await db.execute(`
          UPDATE lessons l 
          JOIN chapters c ON l.chapter_id = c.id 
          JOIN courses co ON c.course_id = co.id 
          SET l.video_url = ? 
          WHERE co.title = ?
        `, [update.video_url, update.title]);
      }
    }
    
    // Update existing courses without images
    const existingCourses = [
      { title: 'React Fundamentals', image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
      { title: 'Node.js Backend', image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400' },
      { title: 'Python for Beginners', image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400' },
      { title: 'JavaScript Mastery', image_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400' },
      { title: 'Database Design', image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400' },
      { title: 'UI/UX Design', image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400' },
      { title: 'Free CSS Course', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { title: 'Digital Marketing Mastery', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' }
    ];
    
    for (const course of existingCourses) {
      await db.execute(
        'UPDATE courses SET image_url = ? WHERE title LIKE ?',
        [course.image_url, `%${course.title}%`]
      );
      console.log(`✅ Updated existing: ${course.title}`);
    }
    
    console.log('✅ All course profiles updated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCourseProfiles();