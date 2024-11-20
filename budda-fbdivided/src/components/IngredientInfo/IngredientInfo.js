import styles from "./IngredientInfo.module.css";
import React, { useState } from "react";

const IngredientInfo = () => {
  const [divs, setDivs] = useState([]);

  const addDiv = () => {
    setDivs([...divs, `새로운 div ${divs.length + 1}`]);
  };

  const removeDiv = (index) => {
    setDivs(divs.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.IngredientInfo}>
      <p className={styles.p}>Ingredients</p>
      <div>
        <button
          onClick={addDiv}
          className={styles.addDiv}
          data-text="Add Ingredients"
        >
          <span>Add Ingredients</span>
        </button>
        {divs.map((text, index) => (
          <div key={index} className={styles.inputDiv}>
            <input
              type="text"
              placeholder="예) 돼지고기"
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="10(수량)"
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="예) g, ml (단위)"
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="예) 비고"
              className={styles.inputField}
            />
            <button
              onClick={() => removeDiv(index)}
              className={styles.removeButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInfo;
