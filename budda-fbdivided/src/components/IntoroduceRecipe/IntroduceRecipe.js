import styles from "./IntroduceRecipe.module.css";
import React, { useState } from "react";

function IntroduceRecipe() {
  const [image, setImage] = useState(null); // 이미지 상태 추가

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 이미지 데이터 URL을 상태에 저장
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.recipeInfo}>
      <div className={styles.recipeInfo_left}>
        <div className={styles.name}>
          <p className={styles.nameP}>Name of recipe</p>
          <input
            type="text"
            className={styles.nameInput}
            id={styles.first}
            size={80}
          />
        </div>
        <div className={styles.name}>
          <p className={styles.nameP}>Introduce recipe</p>
          <input
            type="text"
            className={styles.nameInput}
            size={80}
            style={{ resize: "none" }}
          />
        </div>
        <div className={styles.name}>
          <p className={styles.nameP}>categories</p>
          <form className={styles.form}>
            <select name="categories" className={styles.select}>
              <option>종류별</option>
              <option value={1}>메인반찬</option>
              <option value={2}>국/탕</option>
              <option value={3}>찌게</option>
              <option value={4}>디저트</option>
              <option value={5}>양식</option>
              <option value={6}>면</option>
              <option value={7}>중식</option>
              <option value={8}>기타</option>
            </select>
            <select name="situation" className={styles.select}>
              <option>상황별</option>
              <option value={9}>일상</option>
              <option value={10}>초스피드</option>
              <option value={11}>손님대접</option>
              <option value={12}>다이어트</option>
              <option value={13}>영양식</option>
              <option value={14}>해장</option>
            </select>
            <select name="ingredient" className={styles.select}>
              <option>재료별</option>
              <option value={15}>소고기</option>
              <option value={16}>돼지고기</option>
              <option value={17}>닭고기</option>
              <option value={18}>채소</option>
              <option value={19}>해산물</option>
              <option value={20}>과일</option>
            </select>
          </form>
        </div>
        <div className={styles.name}>
          <p className={styles.nameP}>Information</p>
          <form className={styles.form}>
            <p>인원</p>
            <select name="count" className={styles.select}>
              <option>인원</option>
              <option value={"one"}>1인분</option>
              <option value={"two"}>2인분</option>
              <option value={"three"}>4인분</option>
              <option value={"morethan"}>그 이상</option>
            </select>
            <p>시간</p>
            <select name="time" className={styles.select}>
              <option>시간</option>
              <option value={"5min"}>5분이내</option>
              <option value={"10min"}>10분</option>
              <option value={"20min"}>20분</option>
              <option value={"30min"}>30분</option>
              <option value={"40min"}>40분</option>
              <option value={"50min"}>50분</option>
              <option value={"overtime"}>그 이상</option>
            </select>
            <p>난이도</p>
            <select name="difficulty" className={styles.select}>
              <option>난이도</option>
              <option value={"easy"}>쉬움</option>
              <option value={"middle"}>중간</option>
              <option value={"hard"}>어려움</option>
              <option value={"god"}>신의 경지</option>
            </select>
          </form>
        </div>
      </div>
      <div className={styles.recipeInfo_right} is_over="0">
        <label htmlFor="file-input">
          <img
            id="mainPhotoHolder"
            src={image || "https://recipe1.ezmember.co.kr/img/pic_none4.gif"}
            alt="업로드된 이미지"
            style={{
              cursor: "pointer",
              width: "200px",

              height: "200px", // 원하는 높이
              objectFit: "cover", // 이미지 비율 유지
              border: "2px solid #ccc", // 테두리 추가 (선택 사항)
              borderRadius: "8px",
            }}
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
  );
}

export default IntroduceRecipe;
