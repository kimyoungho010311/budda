import { useState } from "react";
import "./SearchPage.css";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

function SearchPage() {
  // 검색필터 상태 관리
  const [filters, setFilters] = useState({
    categories: "",
    situation: "",
    ingredient: "",
    count: "",
    time: "",
    difficulty: "",
  });

  // 검색 결과 상태 관리
  const [results, setResults] = useState([]);

  // 입력값 변경 관리
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = async () => {
    try {
      // 서버에 필터 데이터 전송
      const response = await fetch("https://backend-api.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await response.json();
      setResults(data); // 검색 결과 업데이트
    } catch (error) {
      console.log("Error fetching search results", error);
    }
  };

  return (
    <div className="SearchPage">
      <NavBar />
      <div className="WrapSearchPage">
        <div className="WrapOptions">
          <div>
            <label className="optionsLabel">category</label>
            <select
              className="optionsSelect"
              name="categories"
              value={filters.categories}
              onChange={handleFilterChange}
            >
              <option value="">category</option>
              <option value="main">main</option>
              <option value="soup">soup</option>
              <option value="dessert">dessert</option>
            </select>
          </div>
          <div>
            <label className="optionsLabel">situation</label>
            <select
              className="optionsSelect"
              name="situation"
              value={filters.situation}
              onChange={handleFilterChange}
            >
              <option value="">situation</option>
              <option value="daily">daily</option>
              <option value="diet">diet</option>
            </select>
          </div>
          <div>
            <label className="optionsLabel">ingredient</label>
            <select
              className="optionsSelect"
              name="ingredient"
              value={filters.ingredient}
              onChange={handleFilterChange}
            >
              <option value="">ingredient</option>
              <option value="meat">meat</option>
              <option value="vegetable">vegetable</option>
            </select>
          </div>
          <div>
            <label className="optionsLabel">count</label>
            <select
              className="optionsSelect"
              name="count"
              value={filters.count}
              onChange={handleFilterChange}
            >
              <option value="">count</option>
              <option value="one">For one</option>
              <option value="two">For two</option>
            </select>
          </div>
          <div>
            <label className="optionsLabel">time</label>
            <select
              className="optionsSelect"
              name="time"
              value={filters.time}
              onChange={handleFilterChange}
            >
              <option value="">time</option>
              <option value="10min">10min</option>
              <option value="20min">20min</option>
            </select>
          </div>
          <div>
            <label className="optionsLabel">difficulty</label>
            <select
              className="optionsSelect"
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">difficulty</option>
              <option value="easy">easy</option>
              <option value="hard">hard</option>
            </select>
          </div>
          <button className="searchBtn" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="SearchResults">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="resultCard">
                <h3>{result.title}</h3>
                <p>{result.description}</p>
              </div>
            ))
          ) : (
            <div className="noResults">
              <p>No results found :(</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
