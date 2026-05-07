const db = require('../config/database');

class RecommendationController {
  // Content-based filtering algorithm
  static async getRecommendations(req, res) {
    try {
      const { courseId } = req.params;
      
      // Get target course details
      const [targetCourse] = await db.execute(`
        SELECT * FROM courses WHERE id = ? AND status = 'published'
      `, [courseId]);
      
      if (targetCourse.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Get all other courses
      const [allCourses] = await db.execute(`
        SELECT c.*, u.username as instructor_name,
               COUNT(DISTINCT e.id) as enrollment_count
        FROM courses c
        JOIN users u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.id != ? AND c.status = 'published'
        GROUP BY c.id
      `, [courseId]);
      
      // Calculate similarity scores
      const recommendations = allCourses.map(course => {
        const similarity = RecommendationController.calculateSimilarity(targetCourse[0], course);
        return {
          ...course,
          similarity_score: Math.round(similarity * 100),
          price: parseFloat(course.price),
          formatted_price: `NRS ${parseFloat(course.price)}`
        };
      }).sort((a, b) => b.similarity_score - a.similarity_score).slice(0, 6);
      
      res.json({ recommendations });
      
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Calculate content similarity
  static calculateSimilarity(target, course) {
    let score = 0;
    
    // Category match (60% weight)
    if (target.category === course.category) {
      score += 0.6;
    }
    
    // Title similarity (30% weight)
    const titleSim = RecommendationController.titleSimilarity(target.title, course.title);
    score += titleSim * 0.3;
    
    // Price similarity (10% weight)
    const priceSim = RecommendationController.priceSimilarity(target.price, course.price);
    score += priceSim * 0.1;
    
    return score;
  }
  
  // Calculate title similarity using keywords
  static titleSimilarity(title1, title2) {
    const words1 = RecommendationController.extractKeywords(title1);
    const words2 = RecommendationController.extractKeywords(title2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const common = words1.filter(w => words2.includes(w)).length;
    return common / Math.max(words1.length, words2.length);
  }
  
  // Extract keywords from title
  static extractKeywords(title) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'in', 'on', 'to', 'for', 'of', 'with'];
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.includes(w));
  }
  
  // Calculate price similarity
  static priceSimilarity(price1, price2) {
    const max = Math.max(price1, price2);
    if (max === 0) return 1;
    return 1 - Math.abs(price1 - price2) / max;
  }

  // Simple personalized recommendations
  static async getPersonalizedRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      const [recommendations] = await db.execute(`
        SELECT c.*, u.username as instructor_name,
               COUNT(DISTINCT e.id) as enrollment_count
        FROM courses c
        JOIN users u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.status = 'published'
        AND c.id NOT IN (SELECT course_id FROM enrollments WHERE user_id = ?)
        GROUP BY c.id
        ORDER BY enrollment_count DESC
        LIMIT 6
      `, [userId]);
      
      res.json({
        recommendations: recommendations.map(rec => ({
          ...rec,
          price: parseFloat(rec.price),
          formatted_price: `NRS ${parseFloat(rec.price)}`
        }))
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = RecommendationController;