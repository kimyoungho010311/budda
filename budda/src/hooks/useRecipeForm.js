import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // jwt-decode 패키지 사용

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

  const [googleId, setGoogleId] = useState(null);

  // Google ID 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // localStorage에서 accessToken 가져오기
    if (token) {
      try {
        const decoded = jwtDecode(token); // JWT 디코딩
        setGoogleId(decoded.googleId); // googleId 설정
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

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
      if (!googleId) {
        alert("User ID not found. Please log in.");
        return;
      }

      const payload = {
        ...formData,
        googleId, // Google ID 추가
        categories: JSON.stringify(formData.categories),
        info: JSON.stringify(formData.info),
        ingredients: JSON.stringify(formData.ingredients),
        image: formData.image, // Base64 이미지 포함
      };

      console.log("FormData being sent:", payload);

      const response = await fetch("http://localhost:5000/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Recipe submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        alert("Failed to submit the recipe. :(");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
  };

  return {
    formData,
    googleId,
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
