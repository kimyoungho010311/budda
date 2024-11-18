import { useState } from "react";

const useRecipeForm = () => {
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeIntroduction: "",
    categories: { type: "", situation: "", ingredient: "" },
    info: { count: "", time: "", difficulty: "" },
    ingredients: [], // 재료 리스트
    steps: "", // 조리 과정 (Quill 에디터에서 입력된 데이터)
    image: null, // 업로드된 이미지
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["type", "situation", "ingredient"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        categories: { ...prev.categories, [name]: value },
      }));
    } else if (["count", "time", "difficulty"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        info: { ...prev.info, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: "", quantity: "", unit: "", note: "" },
      ],
    }));
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      ingredients: updatedIngredients,
    }));
  };

  const handleStepsChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      steps: content,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://my-backend-api.com/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Recipe submitted successfully!");
      } else {
        alert("Failed to submit the recipe. :(");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
  };

  return {
    formData,
    handleFileChange,
    handleInputChange,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    handleStepsChange,
    handleSubmit,
  };
};

export default useRecipeForm;