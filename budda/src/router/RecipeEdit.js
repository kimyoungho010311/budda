import "../components/IntoroduceRecipe/IntroduceRecipe.css"; // 동일한 스타일링 사용
import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import useRecipeForm from "../hooks/useRecipeForm"; // 커스텀 훅 경로
import { useParams, useNavigate } from "react-router-dom";

function RecipeEdit() {
  const {
    formData,
    setFormData,
    handleFileChange,
    handleInputChange,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    handleStepsChange,
  } = useRecipeForm();
  const { id } = useParams(); // 게시물 ID 가져오기
  const navigate = useNavigate();

  // 기존 게시물 데이터를 가져와 폼에 반영
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.status}`);
        }
        const recipeData = await response.json();

        // 폼 데이터 업데이트
        setFormData({
          recipeName: recipeData.recipeName || "",
          recipeIntroduction: recipeData.recipeIntroduction || "",
          categories: recipeData.categories || {
            type: "",
            situation: "",
            ingredient: "",
          },
          info: recipeData.info || { count: "", time: "", difficulty: "" },
          ingredients: recipeData.ingredients || [],
          steps: recipeData.steps || "",
          image: recipeData.image || null, // Base64 이미지
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id, setFormData]);

  // 수정 완료 요청
  const handleUpdateSubmit = async () => {
    if (window.confirm("레시피를 수정하시겠습니까?")) {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("수정이 완료되었습니다!");
          navigate(`/recipes/${id}`); // 수정 후 상세 페이지로 이동
        } else {
          alert("수정에 실패하였습니다.");
        }
      } catch (error) {
        console.error("수정에 실패하였습니다:", error);
      }
    }
  };

  return (
    <div>
      <div className="recipeInfo">
        <div className="recipeInfo_left">
          <div className="name">
            <p className="nameP">Name of recipe</p>
            <input
              type="text"
              name="recipeName"
              className="recipeName"
              size={80}
              value={formData.recipeName}
              onChange={handleInputChange}
            />
          </div>
          <div className="name">
            <p className="nameP">Introduce recipe</p>
            <input
              type="text"
              name="recipeIntroduction"
              className="recipeIntroduction"
              size={80}
              value={formData.recipeIntroduction}
              onChange={handleInputChange}
            />
          </div>
          <div className="name">
            <p className="nameP">Categories</p>
            <form className="form">
              <select
                name="type"
                value={formData.categories.type}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">종류별</option>
                <option value="main">메인반찬</option>
                <option value="soup">국/탕</option>
                <option value="dessert">디저트</option>
              </select>
              <select
                name="situation"
                value={formData.categories.situation}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">상황별</option>
                <option value="daily">일상</option>
                <option value="diet">다이어트</option>
              </select>
              <select
                name="ingredient"
                value={formData.categories.ingredient}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">재료별</option>
                <option value="meat">소고기</option>
                <option value="vegetable">채소</option>
              </select>
            </form>
          </div>
          <div className="name">
            <p className="nameP">Information</p>
            <form className="form">
              <p>인원</p>
              <select
                name="count"
                value={formData.info.count}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">인원</option>
                <option value="1">1인분</option>
                <option value="2">2인분</option>
              </select>
              <p>시간</p>
              <select
                name="time"
                value={formData.info.time}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">시간</option>
                <option value="10min">10분</option>
                <option value="20min">20분</option>
              </select>
              <p>난이도</p>
              <select
                name="difficulty"
                value={formData.info.difficulty}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">난이도</option>
                <option value="easy">쉬움</option>
                <option value="hard">어려움</option>
              </select>
            </form>
          </div>
        </div>
        <div className="recipeInfo_right">
          <label htmlFor="file-input">
            <img
              className="recipeInfo_right_img"
              src={
                formData.image ||
                "https://recipe1.ezmember.co.kr/img/pic_none4.gif"
              }
              alt="업로드된 이미지"
            />
          </label>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="IngredientInfo">
        <div className="Ingredient">
          <p className="p">Ingredients</p>
          <button onClick={addIngredient} className="addDiv">
            Add Ingredients
          </button>
        </div>
        <div className="inputDiv-container">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="inputDiv">
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Note"
                value={ingredient.note}
                onChange={(e) =>
                  handleIngredientChange(index, "note", e.target.value)
                }
              />
              <button onClick={() => removeIngredient(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className="howToCook">
        <ReactQuill
          value={formData.steps}
          onChange={handleStepsChange}
          style={{ width: "", height: "600px" }}
        />
      </div>
      <div className="wrappSubmitBtn">
        <button onClick={handleUpdateSubmit} className="submitBtn">
          Update Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeEdit;
