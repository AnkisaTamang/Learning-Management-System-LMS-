const db = require('../config/database');

class SearchController {
  // Advanced search with multiple algorithms
  static async search(req, res) {
    try {
      const { query, category, priceRange, sortBy } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query required' });
      }

      // Get all courses for search
      const [allCourses] = await db.execute(`
        SELECT c.*, u.username as instructor_name,
               COUNT(DISTINCT e.id) as enrollment_count
        FROM courses c
        JOIN users u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.status = 'published'
        GROUP BY c.id
      `);

      // Apply search algorithms
      let results = SearchController.fuzzySearch(allCourses, query);
      
      // Apply filters
      if (category) {
        results = results.filter(course => course.category.toLowerCase() === category.toLowerCase());
      }
      
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        results = results.filter(course => course.price >= min && course.price <= max);
      }

      // Sort results
      results = SearchController.sortResults(results, sortBy);

      res.json({
        results: results.slice(0, 20),
        total: results.length,
        query,
        algorithm: 'Fuzzy Search + Levenshtein Distance'
      });

    } catch (error) {
      res.status(500).json({ message: 'Search error', error: error.message });
    }
  }

  // Fuzzy search algorithm with Levenshtein distance
  static fuzzySearch(courses, query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return courses.map(course => {
      let totalScore = 0;
      let matches = 0;

      // Search in title
      const titleScore = SearchController.calculateFuzzyScore(course.title, searchTerms);
      totalScore += titleScore * 0.6; // 60% weight for title

      // Search in description
      if (course.description) {
        const descScore = SearchController.calculateFuzzyScore(course.description, searchTerms);
        totalScore += descScore * 0.3; // 30% weight for description
      }

      // Search in category
      const categoryScore = SearchController.calculateFuzzyScore(course.category, searchTerms);
      totalScore += categoryScore * 0.1; // 10% weight for category

      return {
        ...course,
        price: parseFloat(course.price),
        formatted_price: `NRS ${parseFloat(course.price)}`,
        search_score: Math.round(totalScore * 100),
        relevance: totalScore
      };
    })
    .filter(course => course.relevance > 0.1) // Filter out very low relevance
    .sort((a, b) => b.relevance - a.relevance);
  }

  // Calculate fuzzy matching score
  static calculateFuzzyScore(text, searchTerms) {
    if (!text) return 0;
    
    const textLower = text.toLowerCase();
    let maxScore = 0;

    for (const term of searchTerms) {
      // Exact match gets highest score
      if (textLower.includes(term)) {
        maxScore = Math.max(maxScore, 1.0);
        continue;
      }

      // Fuzzy matching using Levenshtein distance
      const words = textLower.split(' ');
      for (const word of words) {
        const distance = SearchController.levenshteinDistance(term, word);
        const similarity = 1 - (distance / Math.max(term.length, word.length));
        
        if (similarity > 0.6) { // 60% similarity threshold
          maxScore = Math.max(maxScore, similarity * 0.8);
        }
      }
    }

    return maxScore;
  }

  // Levenshtein distance algorithm
  static levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Sort results by different criteria
  static sortResults(results, sortBy) {
    switch (sortBy) {
      case 'price_low':
        return results.sort((a, b) => a.price - b.price);
      case 'price_high':
        return results.sort((a, b) => b.price - a.price);
      case 'popular':
        return results.sort((a, b) => b.enrollment_count - a.enrollment_count);
      case 'newest':
        return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return results; // Already sorted by relevance
    }
  }

  // Auto-complete suggestions
  static async suggestions(req, res) {
    try {
      const { query } = req.query;
      
      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      const [courses] = await db.execute(`
        SELECT DISTINCT title, category FROM courses 
        WHERE status = 'published' 
        AND (title LIKE ? OR category LIKE ?)
        LIMIT 10
      `, [`%${query}%`, `%${query}%`]);

      const suggestions = [
        ...courses.map(c => c.title),
        ...courses.map(c => c.category)
      ].filter((item, index, arr) => arr.indexOf(item) === index);

      res.json({ suggestions: suggestions.slice(0, 8) });

    } catch (error) {
      res.status(500).json({ message: 'Suggestions error', error: error.message });
    }
  }
}

module.exports = SearchController;