const fs = require('fs');
const path = require('path');
const db = require('./backend/config/database');

// Revert currency changes
function revertCurrencyChanges(dir) {
  const files = fs.readdirSync(dir);
  let revertedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      revertedCount += revertCurrencyChanges(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Revert रु back to $
        content = content.replace(/रु\{/g, '${');
        content = content.replace(/रु([0-9])/g, '$$$1');
        content = content.replace(/रु\{parseFloat\(/g, '${parseFloat(');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Reverted: ${filePath}`);
          revertedCount++;
        }
      } catch (error) {
        console.error(`❌ Error reverting ${filePath}:`, error.message);
      }
    }
  });
  
  return revertedCount;
}

// Update course profiles
async function updateCourseProfiles() {
  const courseProfiles = [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
    { id: 2, image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400' },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400' },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400' },
    { id: 5, image_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400' },
    { id: 6, image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400' },
    { id: 7, image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400' },
    { id: 8, image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: 9, image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400' },
    { id: 10, image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' }
  ];
  
  for (const profile of courseProfiles) {
    await db.execute(
      'UPDATE courses SET image_url = ? WHERE id = ?',
      [profile.image_url, profile.id]
    );
    console.log(`✅ Updated course ${profile.id} image`);
  }
  
  // Update lessons with educational videos
  await db.execute(`
    UPDATE lessons l 
    JOIN chapters c ON l.chapter_id = c.id 
    JOIN courses co ON c.course_id = co.id 
    SET l.video_url = CASE 
      WHEN co.category LIKE '%Programming%' THEN 'https://www.youtube.com/watch?v=UB1O30fR-EE'
      WHEN co.category LIKE '%Design%' THEN 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU'
      WHEN co.category LIKE '%Marketing%' THEN 'https://www.youtube.com/watch?v=nU-IIXBWlS4'
      WHEN co.category LIKE '%Business%' THEN 'https://www.youtube.com/watch?v=ZoqgAy3h4OM'
      WHEN co.category LIKE '%Health%' THEN 'https://www.youtube.com/watch?v=xyQY8a-ng6g'
      ELSE 'https://www.youtube.com/watch?v=UB1O30fR-EE'
    END
  `);
  console.log('✅ Updated all lesson videos');
}

async function main() {
  console.log('🔄 Reverting currency changes...');
  const revertedCount = revertCurrencyChanges('c:\\Users\\Ankisha\\Desktop\\LMS0\\client\\src');
  console.log(`✅ Reverted ${revertedCount} files`);
  
  console.log('🖼️ Updating course profiles...');
  await updateCourseProfiles();
  
  console.log('✅ All changes completed!');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});