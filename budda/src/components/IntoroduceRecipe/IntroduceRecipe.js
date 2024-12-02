import "./IntroduceRecipe.css";
import React from "react";
import ReactQuill from "react-quill";
import useRecipeForm from "../../hooks/useRecipeForm"; // 커스텀 훅 경로
import { Link } from "react-router-dom";

function IntroduceRecipe() {
  const {
    formData,
    handleFileChange,
    handleInputChange,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    handleStepsChange,
    handleSubmit,
  } = useRecipeForm();

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
            <p className="nameP">categories</p>
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
        {/* 재료 리스트를 세로로 배치 */}
        <div className="inputDiv-container">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="inputDiv">
              <input
                type="text"
                placeholder="재료명"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="양"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="단위"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="메모"
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
      <Link to="/budda">
        <div className="wrappSubmitBtn">
          <button onClick={handleSubmit} className="submitBtn">
            Submit Recipe
          </button>
        </div>
      </Link>
    </div>
  );
}

export default IntroduceRecipe;
