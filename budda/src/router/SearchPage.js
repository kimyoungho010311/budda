import { useState } from "react";
import "./SearchPage.css";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";

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
    const filtersToSend = {
      ...filters,
      count: filters.count ? parseInt(filters.count, 10) : undefined, // 숫자로 변환
    };

    console.log("Filters being sent:", filtersToSend);

    try {
      // 서버에 필터 데이터 전송
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtersToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data); // 검색 결과 업데이트
    } catch (error) {
      console.log("Error fetching search results", error);
    }
  };

  const handleRefresh = () => {
    // 검색필터 초기화
    setFilters({
      categories: "",
      situation: "",
      ingredient: "",
      count: "",
      time: "",
      difficulty: "",
    });

    // 검색 결과 초기화
    setResults([]);
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
              <option value="">종류별</option>
              <option value="main">메인반찬</option>
              <option value="soup">국/탕</option>
              <option value="dessert">디저트</option>
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
              <option value="">상황별</option>
              <option value="daily">일상</option>
              <option value="diet">다이어트</option>
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
              <option value="">재료별</option>
              <option value="meat">소고기</option>
              <option value="vegetable">채소</option>
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
              <option value="">인원</option>
              <option value="one">1인분</option>
              <option value="two">2인분</option>
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
              <option value="">시간</option>
              <option value="10min">10분</option>
              <option value="20min">20분</option>
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
              <option value="">난이도</option>
              <option value="easy">쉬움</option>
              <option value="hard">어려움</option>
            </select>
          </div>
          <button className="searchBtn" onClick={handleSearch}>
            Search
          </button>
          <button className="searchBtn" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
        <div className="SearchResults">
          {results.length > 0 ? (
            results.map((result, index) => (
              <Link to={`/recipe/${result._id}`} className="resultCardLink">
                <div key={index} className="resultCard">
                  <h3>{result.recipeName}</h3>
                  <div className="wrapp_info">
                    <div>
                      {/* <p>ID : {result._id}</p> */}
                      <p>종류 : {result.categories.type}</p>
                      <p>상황 : {result.categories.situation}</p>
                      <p>난이도 : {result.info.difficulty}</p>
                    </div>
                    <div className="wrapp_IMG">
                      <div className="IMG">IMG</div>
                    </div>
                  </div>
                  <p className="p_info">{result.recipeIntroduction}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="wrappNoResults">
              <p className="noResults">No results found :(</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
