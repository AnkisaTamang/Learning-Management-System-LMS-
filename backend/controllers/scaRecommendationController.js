const db = require('../config/database');

class SCARecommendationController {
  // Sine Cosine Algorithm for course recommendations
  static async getRecommendations(req, res) {
    try {
      const { courseId } = req.params;
      
      // Get selected course with content details
      const [selectedCourse] = await db.execute(`
        SELECT c.*, 
               COUNT(DISTINCT ch.id) as chapter_count,
               COUNT(DISTINCT l.id) as lesson_count,
               COALESCE(SUM(l.duration), 0) as total_duration
        FROM courses c
        LEFT JOIN chapters ch ON c.id = ch.course_id
        LEFT JOIN lessons l ON ch.id = l.chapter_id
        WHERE c.id = ? AND c.status = 'published'
        GROUP BY c.id
      `, [courseId]);
      
      if (selectedCourse.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const targetCourse = selectedCourse[0];
      
      // Get all other courses for SCA optimization
      const [allCourses] = await db.execute(`
        SELECT c.*, u.username as instructor_name,
               COUNT(DISTINCT e.id) as enrollment_count,
               COALESCE(AVG(r.rating), 0) as avg_rating,
               COUNT(DISTINCT ch.id) as chapter_count,
               COUNT(DISTINCT l.id) as lesson_count,
               COALESCE(SUM(l.duration), 0) as total_duration
        FROM courses c
        JOIN users u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN course_ratings r ON c.id = r.course_id
        LEFT JOIN chapters ch ON c.id = ch.course_id
        LEFT JOIN lessons l ON ch.id = l.chapter_id
        WHERE c.id != ? AND c.status = 'published'
        GROUP BY c.id
      `, [courseId]);
      
      // Apply Sine Cosine Algorithm
      const recommendations = SCARecommendationController.applySCA(targetCourse, allCourses);
      
      res.json({
        recommendations: recommendations.slice(0, 6),
        algorithm: 'Sine Cosine Algorithm',
        target_course: {
          title: targetCourse.title,
          chapters: targetCourse.chapter_count,
          lessons: targetCourse.lesson_count,
          duration: targetCourse.total_duration
        }
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // Sine Cosine Algorithm implementation
  static applySCA(targetCourse, courses) {
    const maxIterations = 10;
    const a = 2; // Control parameter
    
    // Normalize course features
    const normalizedTarget = SCARecommendationController.normalizeCourse(targetCourse);
    const normalizedCourses = courses.map(course => ({
      ...course,
      normalized: SCARecommendationController.normalizeCourse(course)
    }));
    
    // Initialize positions (similarity scores)
    let positions = normalizedCourses.map(course => ({
      ...course,
      position: Math.random(), // Random initial position
      fitness: 0
    }));
    
    // Find best position (most similar course)
    let bestPosition = positions[0];
    
    // SCA iterations
    for (let t = 0; t < maxIterations; t++) {
      const r1 = a * (1 - t / maxIterations); // Decreasing parameter
      
      positions = positions.map(course => {
        const r2 = 2 * Math.PI * Math.random(); // Random angle
        const r3 = Math.random() * 2; // Random weight
        const r4 = Math.random(); // Random selector
        
        let newPosition;
        
        if (r4 < 0.5) {
          // Sine component
          newPosition = course.position + r1 * Math.sin(r2) * Math.abs(r3 * bestPosition.position - course.position);
        } else {
          // Cosine component  
          newPosition = course.position + r1 * Math.cos(r2) * Math.abs(r3 * bestPosition.position - course.position);
        }
        
        // Ensure position stays in bounds
        newPosition = Math.max(0, Math.min(1, newPosition));
        
        // Calculate fitness (similarity score)
        const fitness = SCARecommendationController.calculateSimilarity(
          normalizedTarget, 
          course.normalized, 
          targetCourse, 
          course
        );
        
        // Update best position
        if (fitness > bestPosition.fitness) {
          bestPosition = { ...course, position: newPosition, fitness };
        }
        
        return {
          ...course,
          position: newPosition,
          fitness: fitness,
          sca_score: Math.round(fitness * 100)
        };
      });
    }
    
    // Sort by fitness (similarity) and return
    return positions
      .sort((a, b) => b.fitness - a.fitness)
      .map(course => ({
        ...course,
        price: parseFloat(course.price),
        avg_rating: parseFloat(course.avg_rating),
        total_duration: course.total_duration
      }));
  }
  
  // Normalize course features to [0,1] range
  static normalizeCourse(course) {
    return {
      chapters: Math.min(course.chapter_count / 20, 1), // Max 20 chapters
      lessons: Math.min(course.lesson_count / 100, 1), // Max 100 lessons  
      duration: Math.min(course.total_duration / 3600, 1), // Max 60 hours
      price: Math.min(course.price / 500, 1), // Max $500
      rating: (course.avg_rating || 0) / 5 // Max 5 stars
    };
  }
  
  // Calculate similarity between two normalized courses (with content features)
  static calculateSimilarity(target, course, targetCourse, currentCourse) {
    const weights = {
      category: 0.4,    // Content-based: same category
      title: 0.2,       // Content-based: title keywords
      chapters: 0.15,   // Structural similarity
      lessons: 0.1,     // Structural similarity
      duration: 0.1,    // Structural similarity
      price: 0.05       // Price similarity
    };
    
    let similarity = 0;
    
    // Content-based features
    if (targetCourse.category === currentCourse.category) {
      similarity += weights.category;
    }
    
    // Title similarity
    const titleSim = this.calculateTitleSimilarity(targetCourse.title, currentCourse.title);
    similarity += weights.title * titleSim;
    
    // Structural features (Euclidean distance-based)
    const structuralFeatures = ['chapters', 'lessons', 'duration', 'price'];
    for (const feature of structuralFeatures) {
      const diff = Math.abs(target[feature] - course[feature]);
      similarity += weights[feature] * (1 - diff);
    }
    
    return Math.max(0, similarity);
  }
  
  // Calculate title similarity based on common keywords
  static calculateTitleSimilarity(title1, title2) {
    const keywords1 = this.extractKeywords(title1);
    const keywords2 = this.extractKeywords(title2);
    
    if (keywords1.length === 0 || keywords2.length === 0) return 0;
    
    const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword));
    return commonKeywords.length / Math.max(keywords1.length, keywords2.length);
  }
  
  // Extract meaningful keywords from course title
  static extractKeywords(title) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'course', 'learn', 'complete', 'guide', 'tutorial', 'basics', 'fundamentals'];
    
    return title.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }
}

module.exports = SCARecommendationController;