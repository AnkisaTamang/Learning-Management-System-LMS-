import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch suggestions as user types
  useEffect(() => {
    if (input.length >= 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await API.get(`/search/suggestions?query=${input}`);
          setSuggestions(response.data.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };
      
      const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input]);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      console.log('Searching for:', input);
      setShowSuggestions(false);
      navigate('/search-results?query=' + encodeURIComponent(input));
    }
  };

  const selectSuggestion = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    navigate('/search-results?query=' + encodeURIComponent(suggestion));
  };

  return (
    <div className="relative max-w-xl w-full">
      <form onSubmit={onSearchHandler} className='md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
        <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3'/>
        <input 
          onChange={e => setInput(e.target.value)} 
          value={input}
          type="text" 
          placeholder='Search for courses' 
          className='w-full h-full outline-none text-gray-500/80'
          onFocus={() => input.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <button type='submit' className='bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1'>Search</button>
      </form>
      
      {/* Auto-complete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;