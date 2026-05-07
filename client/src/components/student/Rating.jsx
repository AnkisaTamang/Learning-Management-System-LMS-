import React, { useEffect, useState } from 'react'

const Rating = ({initialRating, onRate}) => {
  // Initialize rating state, defaulting to 0 if initialRating is null/undefined
  const [rating, setRating] = useState(initialRating || 0);

  // Function to handle setting the rating
  const handleRating = (value) => {
    setRating(value);
    // Call the parent callback function if provided
    if (onRate) onRate(value);
  }

  // Update local state if the initialRating prop changes from the parent
  useEffect(() => {
    if (initialRating) {
      setRating(initialRating)
    }
  }, [initialRating]);

  return (
    <div>
      {/* FIX 1: Typo correction. 
        Change 'lenght' to 'length' for Array.from.
      */}
      {Array.from({ length: 5 }, (_, index) => {
        
        // FIX 2: Variable name correction.
        // Change 'index + i' to 'index + 1' to correctly calculate the star value (1 to 5).
        const starValue = index + 1; 

        return(
          <span 
            key={index} 
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ?
              'text-yellow-500' : 'text-gray-400' }`} 
            onClick={() => handleRating(starValue)}
          >
            {/* Unicode for a solid star */}
            &#9733;
          </span>
        )
      })}
    </div>
  )
}

export default Rating