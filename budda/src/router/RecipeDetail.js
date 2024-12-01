import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import HowToUse from "../components/HowToUse/HowToUse";
import { jwtDecode } from "jwt-decode";
import "./RecipeDetail.css";
import { useNavigate } from "react-router-dom";

const currentUserGoogleId =
  localStorage.getItem("token") &&
  jwtDecode(localStorage.getItem("token")).sub;

function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleIngredientClick = (ingredientName) => {
    const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(
      ingredientName
    )}`;
    window.open(searchUrl, "_blank");
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/comments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
      const commentsData = await response.json();
      setComments(commentsData);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.status}`);
        }
        const recipeData = await response.json();
        setRecipe(recipeData);
        setLikes(recipeData.likes?.length || 0);
        setHasLiked(recipeData.likes?.includes(currentUserGoogleId) || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const saveViewedRecipe = () => {
      const viewedRecipes = JSON.parse(localStorage.getItem("recentRecipes")) || [];
      const updatedRecipes = [id, ...viewedRecipes.filter((recipeId) => recipeId !== id)].slice(0, 5); // 중복 제거 및 최대 5개
      localStorage.setItem("recentRecipes", JSON.stringify(updatedRecipes));
    };

    fetchRecipe();
    fetchComments();
    saveViewedRecipe();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }
  
    const token = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }), // userId는 서버에서 JWT로 확인
      });
  
      if (!response.ok) {
        throw new Error("댓글 추가에 실패했습니다.");
      }
  
      const { comment } = await response.json(); // 서버 응답에서 새 댓글 데이터 추출
  
      setComments((prevComments) => [...prevComments, comment]); // 기존 댓글에 새 댓글 추가
      setNewComment(""); // 입력 필드 초기화
    } catch (err) {
      console.error("Error adding comment:", err.message);
      alert("댓글 추가 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };
  

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) {
      alert("수정할 내용을 입력하세요.");
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to edit comment: ${response.statusText}`);
      }
  
      const updatedComment = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? updatedComment.comment : comment
        )
      );
      setEditingComment(null);
      setEditContent("");
    } catch (err) {
      console.error("Error editing comment:", err.message);
      alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      }
  
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err.message);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };
  

  const handleDelete = async () => {
    if (window.confirm("레시피를 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("삭제가 완료되었습니다.");
          navigate("/search");
        } else {
          alert("삭제에 실패하였습니다.");
        }
      } catch (error) {
        console.error("삭제에 실패하였습니다:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/recipes/edit/${id}`, { state: { recipe } }); // 수정 페이지로 이동
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!recipe) return <p>No recipe found</p>;

  const handleLike = async () => {
    const token = localStorage.getItem("accessToken"); // 서버에서 발급한 JWT
    if (!currentUserGoogleId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 좋아요 취소 확인 메시지
    if (hasLiked && !window.confirm("좋아요를 취소하시겠습니까?")) {
      return;
    }
    console.log(`------------------------------------------------`);
    console.log("좋아요 요청 전송: AccessToken:", token);
    console.log("좋아요 요청 전송: UserID:", currentUserGoogleId);
    console.log("Token:", token);
    console.log("UserID:", currentUserGoogleId);
    console.log(`------------------------------------------------`);

    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
        },
        body: JSON.stringify({ userId: currentUserGoogleId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("좋아요 처리 실패:", errorData);
        throw new Error("Failed to update likes");
      }

      const data = await response.json();
      setLikes(data.likes);
      setHasLiked(data.hasLiked);
    } catch (err) {
      console.error("Error updating like:", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="RecipeDetail">
        <div className="wrapp_recipe_info">
          <h1>{recipe.recipeName}</h1>
          <p>{recipe.recipeIntroduction}</p>
          {userInfo && (
            <div className="userInfo">
              <img
                src={userInfo.picture}
                alt={`${userInfo.name}'s profile`}
                className="userProfileImage"
              />
              <h3>{userInfo.name}</h3>
            </div>
          )}
        </div>
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.recipeName}
            className="recipeImage"
          />
        ) : (
          <p>No image available</p>
        )}
        <div className="wrapp_catgoreis_info">
          <div className="categories">
            <h3>Categories</h3>
            <div className="wrapp_categories_info">
              <p>Type: {recipe.categories?.type}</p>
              <p>Situation: {recipe.categories?.situation}</p>
              <p>Ingredient: {recipe.categories?.ingredient}</p>
            </div>
          </div>

          <div className="info">
            <h3>Info</h3>
            <div className="info_wrapp_info">
              <p>Count: {recipe.info?.count}</p>
              <p>Time: {recipe.info?.time}</p>
              <p>Difficulty: {recipe.info?.difficulty}</p>
            </div>
          </div>
        </div>

        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul>
            <div className="wrapp_ingredients">
              {recipe.ingredients?.map((ingredient, index) => (
                <div key={index} className="wrapp_ingredients_index">
                  {ingredient.name} : {ingredient.quantity} {ingredient.unit}{" "}
                  {ingredient.note}{" "}
                  <button
                    className="ingredient_btn"
                    onClick={() => handleIngredientClick(ingredient.name)}
                  >
                    재료 구매하기
                  </button>
                </div>
              ))}
            </div>
          </ul>
        </div>

        <div className="steps">
          <h3>Steps</h3>
          <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
        </div>
      </div>
      <div className="wrapp_btns">
        {currentUserGoogleId === recipe.userId && (
          <>
            <button className="btn" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn" onClick={handleUpdate}>
              Update
            </button>
          </>
        )}
      </div>
      <div className="like-btn">
        <button onClick={handleLike}>
          {hasLiked ? "👍 Unlike" : "👍 Like"} {likes}
        </button>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p className="timestamp">
                {new Date(comment.createdAt).toLocaleString()} {/* 작성 시간 표시 */}
              </p>
              {editingComment === comment._id ? (
                // 댓글 수정 모드
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment..."
                  />
                  <button onClick={() => handleEditComment(comment._id)}>Save</button>
                  <button onClick={() => setEditingComment(null)}>Cancel</button>
                </div>
              ) : (
                // 댓글 표시 모드
                <div>
                  <p>
                    <strong>{comment.userId}</strong>: {comment.content}
                  </p>
                  {comment.userId === currentUserGoogleId && (
                    <div className="comment-actions">
                      <button
                        onClick={() => {
                          setEditingComment(comment._id);
                          setEditContent(comment.content);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Post Comment</button>
        </div>
      </div>
      <HowToUse />
      <Footer />
    </div>
  );
}

export default RecipeDetail;
